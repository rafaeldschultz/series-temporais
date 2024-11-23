from controllers.raw_data_controller import RawDataController
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

api_raw = APIRouter(prefix="/raw_data")


@api_raw.get("/")
async def get_raw_data(page: int, page_size: int):
    try:
        controller = RawDataController()
        data = controller.get_data(page, page_size)
        return JSONResponse(status_code=200, content=data)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")
