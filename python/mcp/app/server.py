from asyncio import transports
import re
from typing import Any
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP()

NWS_API_BASE = 'https://api.weather.gov'
USER_AGENT = 'weather-app/1.0'

async def make_nws_request(url: str) -> dict[str, Any] | None:
    headers = {
        'User-Agent': USER_AGENT,
        'Accept': 'application/geo+json'
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, timeout=30.0)
            response.raise_for_status()
            return response.json()
        except Exception:
            return None

def format_alert(feature: dict) -> str:
    props = feature['properties']
    return f"""
        Event: { props.get('event', 'Unknown') }
        Area: { props.get('areaDesc', 'Unknown') }
        Severity: { props.get('severity', 'Unknown') }
        Description: { props.get('description', 'Unknown') }
        Instructions: { props.get('instruction', 'Unknown') }  
    """

@mcp.tool()
async def get_alerts(state: str) -> str:
    """Get weather alerts for a US state.

    Args:
        state: Two-letter US state code (e.g. CA, NY)
    """
    url = f"{NWS_API_BASE}/alerts/active?area={state}"
    data = await make_nws_request(url)

    if not data or 'features' not in data:
        return "No active alerts found."

    if not data['features']:
        return "No active alerts for this state."

    alerts = [format_alert(feature) for feature in data['features']]
    return "\n---\n".join(alerts)

@mcp.tool()
async def get_forecast(latitude: float, longitude: float) -> str:
    """Get weather forecast for a location.

    Args:
        latitude: Latitude of the location
        longitude: Longitude of the location
    """
    url = f"{NWS_API_BASE}/points/{latitude},{longitude}"
    data = await make_nws_request(url)
    if not data or 'properties' not in data:
        return "Unable to fetch forecast data."
    forecast_url = data['properties']['forecast']
    forecast_data = await make_nws_request(forecast_url)
    if not forecast_data or 'properties' not in forecast_data:
        return "Unable to fetch forecast data."
    periods = forecast_data['properties']['periods']

    forecasts = []

    for period in periods:
        forecast = f"""
            { period['name'] }: 
            Temperature: { period['temperature'] } { period['temperatureUnit'] }
            Short Forecast: { period['shortForecast'] }
            Detailed Forecast: { period['detailedForecast'] }
            Wind: { period['windSpeed'] } { period['windDirection'] }
        """
        forecasts.append(forecast)
    return "\n---\n".join(forecasts)

if __name__ == "__main__":
    mcp.run(transport='stdio')