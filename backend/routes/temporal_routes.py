from typing import Optional

from controllers.temporal_controller import TemporalController
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

api_temporal = APIRouter()


@api_temporal.get("/temporal")
async def temporal(
    uf: Optional[str] = None,
    syndrome: Optional[str] = None,
    year: Optional[int] = None,
    evolution: Optional[str] = None,
):
    try:
        controller = TemporalController()
        data = controller.get_temporal_data(uf, syndrome, year, evolution)
        return JSONResponse(status_code=200, content=data)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")


@api_temporal.get("/occurrence_by_sex")
async def occurrence_by_sex(
    uf: Optional[str] = None,
    syndrome: Optional[str] = None,
    year: Optional[int] = None,
    evolution: Optional[str] = None,
):
    try:
        controller = TemporalController()
        data = controller.occurrence_by_sex(uf, syndrome, year, evolution)
        return JSONResponse(status_code=200, content=data)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")


@api_temporal.get("/occurrence_by_race")
async def occurrence_by_race(
    uf: Optional[str] = None,
    syndrome: Optional[str] = None,
    year: Optional[int] = None,
    evolution: Optional[str] = None,
):
    try:
        controller = TemporalController()
        data = controller.occurrence_by_race(uf, syndrome, year, evolution)
        return JSONResponse(status_code=200, content=data)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")
