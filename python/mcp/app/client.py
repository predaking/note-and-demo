import flask
import os
import asyncio
from typing import Optional
from contextlib import AsyncExitStack

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from dotenv import load_dotenv
import openai 

load_dotenv()

openai.api_type = "azure"
openai.api_version = os.getenv('AZURE_OPENAI_API_VERSION')
openai.api_base = os.getenv('AZURE_OPENAI_BASE_URL')
openai.api_key = os.getenv('AZURE_OPENAI_API_KEY')

class MCPClient:
    def __init__(self):
        self.session: Optional[ClientSession] = None
        self.exit_stack = AsyncExitStack()
    
    async def connect(self, server_script_path: str):
        server_params = StdioServerParameters(
            command = 'python3',
            args = [server_script_path],
            env = None
        )
        
        stdio_transport = await self.exit_stack.enter_async_context(
            stdio_client(server_params)
        )

        self.stdio, self.write = stdio_transport
        self.session = await self.exit_stack.enter_async_context(
            ClientSession(self.stdio, self.write)
        )

        await self.session.initialize()

        response = await self.session.list_tools()
        tools = response.tools
        print('利用工具链接服务: ', [tool.name for tool in tools])
        return self.session

    async def process_query(self, query) -> str:
        messages = [
            {'role': 'user', 'content': query}
        ]

        response = await self.session.list_tools()

        print('res: ', dir(response))

        available_tools = [{
            'name': tool.name,
            'description': tool.description,
            # 'parameters': tool.parameters
        } for tool in response.tools]

        response = openai.ChatCompletion.create(
            messages = messages,
            tools = available_tools,
            max_tokens = 1000
        )

        final_text = []

        assistant_message_content = []

        for content in response.content:
            if content.type == 'text':
                assistant_message_content.append(content)
                final_text.append(content.text)
            elif content.type == 'tool_use':
                tool_name = content.name
                tool_args = content.input

                result = await self.session.call_tool(
                    tool_name = tool_name,
                    tool_input = tool_args
                )
                assistant_message_content.append(content)
                final_text.append(f"[Calling tool: {tool_name}] with args {tool_args}")

                messages.append({
                    'role': 'assistant',
                    'content': assistant_message_content
                })

                messages.append({
                    'role': 'tool',
                    'content': [
                        {
                            'type': 'tool_result',
                            'tool_use_id': content.id,
                            'content': result.content
                        }
                    ]
                })

                response = self.openai.chat.completions.create(
                    model = self.model,
                    messages = messages,
                    tools = available_tools,
                    max_tokens = 1000
                )

                final_text.append(response.content[0].text)
        return '\n'.join(final_text) 

    async def chat_loop(self):
        print('开始聊天')
        while True:
            try:
                query = input('请输入您的问题: ').strip()
                if query == 'exit':
                    break
                response = await self.process_query(query)
                print('response: ', response)

            except Exception as e:
                print('发生错误: ', e)
                break
    
    async def cleanup(self):
        await self.exit_stack.aclose()

async def main():
    client = MCPClient()
    try:
        await client.connect('app/server.py')
        await client.chat_loop()
    finally:
        await client.cleanup()

app = flask.Flask(__name__)

if __name__ == '__main__':
    asyncio.run(main())
    # app.run(debug=True, host='0.0.0.0', port=7777)