import flask
import os
import asyncio
from typing import Optional
from contextlib import AsyncExitStack

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from dotenv import load_dotenv

from openai import AzureOpenAI as OpenAI

load_dotenv()

openai = OpenAI(
    api_key = os.getenv('AZURE_OPENAI_API_KEY'),
    api_version = os.getenv('AZURE_API_VERSION'),
    azure_endpoint = os.getenv('AZURE_OPENAI_BASE_URL'),
    azure_deployment = os.getenv('AZURE_OPENAI_DEPLOYMENT_NAME')
)
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

        available_tools = [{
            "type":"function",
            "function":{
                "name": tool.name,
                "description": tool.description, # 工具描述
                "parameters": tool.inputSchema  # 工具输入模式
            }
        } for tool in response.tools]

        response = openai.chat.completions.create(
            model = os.getenv('AZURE_OPENAI_MODEL'),
            messages = [
                {'role': 'user', 'content': '请帮我写一个python程序, hello world'},
            ],
            max_tokens = 1000,
            tools = available_tools,
        )

        print('response: ', response)

        final_text = []

        assistant_message_content = []

        for content in response.choices:
            content = content.message
            print('content: ', content)
            if content.tool_calls == None:
                assistant_message_content.append(content.content)
                final_text.append(content.content)
            else:
                tool_name = content.name
                tool_args = content.input

                result = await self.session.call_tool(
                    tool_name = tool_name,
                    tool_input = tool_args
                )
                assistant_message_content.append(content.content)
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

                response = openai.chat.completions.create(
                    model = os.getenv('AZURE_OPENAI_MODEL'),
                    messages = [
                        {'role': 'user', 'content': '请帮我写一个python程序, hello world'},
                    ],
                    max_tokens = 1000,
                    tools = available_tools,
                )

                print('response: ', response)

                final_text.append(response.content.content)
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
    # response = openai.chat.completions.create(
    #     model = os.getenv('AZURE_OPENAI_MODEL'),
    #     messages = [
    #         {'role': 'user', 'content': '请帮我写一个python程序, hello world'},
    #     ],
    #     max_tokens = 1000,
    # )
    # print('response: ', response)
    # app.run(debug=True, host='0.0.0.0', port=7777)

# ChatCompletion(
#     id='chatcmpl-BFxFkfgXZpjT3rCORQlxvVmNJXW4A', 
#     choices=[
#         Choice(
#             finish_reason='stop', 
#             index=0, 
#             logprobs=None, 
#             message=ChatCompletionMessage(
#                 content='当然可以！以下是一个简单的 Python 程序，它会在控制台输出 "Hello, World!"：\n\n```python\nprint("Hello, World!")\n```\n\n只需将以上代码保存到一个 Python 文件中，例如 `hello.py`，然后在命令行运行该文件：\n\n```sh\npython hello.py\n```\n\n你就会在控制台看到输出的 "Hello, World!"。', 
#                 refusal=None, 
#                 role='assistant', 
#                 annotations=None, 
#                 audio=None, 
#                 function_call=None, 
#                 tool_calls=None
#             ))], 
#             created=1743142388, 
#             model='gpt-4o-2024-05-13', 
#             object='chat.completion', 
#             service_tier=None, 
#             system_fingerprint='fp_ded0d14823', 
#             usage=CompletionUsage(
#                 completion_tokens=86, 
#                 prompt_tokens=17, 
#                 total_tokens=103, 
#                 completion_tokens_details=CompletionTokensDetails(
#                     accepted_prediction_tokens=0, 
#                     audio_tokens=0, 
#                     reasoning_tokens=0, 
#                     rejected_prediction_tokens=0
#                 ), 
#                 prompt_tokens_details=PromptTokensDetails(
#                     audio_tokens=0, 
#                     cached_tokens=0
#                 )))