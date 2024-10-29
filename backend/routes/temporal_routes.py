from controllers.temporal_controller import TemporalController
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

api_temporal = APIRouter()


@api_temporal.get("/temporal")
async def temporal():
    try:
        controller = TemporalController()
        data = controller.get_temporal_data()
        return JSONResponse(status_code=200, content=data)
    except Exception as e:
        print(e)
        return HTTPException(status_code=500, detail="Internal server error")
