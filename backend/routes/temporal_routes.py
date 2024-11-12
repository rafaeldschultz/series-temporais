from typing import Optional

from controllers.temporal_controller import TemporalController
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

api_temporal = APIRouter()


@api_temporal.get("/overview")
async def overview(
    uf: Optional[str] = None,
    syndrome: Optional[str] = None,
    year: Optional[int] = None,
    evolution: Optional[str] = None,
):
    try:
        controller = TemporalController()
        data = controller.get_overview_data(uf, syndrome, year, evolution)
        return JSONResponse(status_code=200, content=data)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")


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


@api_temporal.get("/occurrence_by_day")
async def occurrence_by_day(
    uf: Optional[str] = None,
    syndrome: Optional[str] = None,
    year: Optional[int] = None,
    evolution: Optional[str] = None,
):
    try:
        controller = TemporalController()
        data = controller.occurrence_by_day(uf, syndrome, year, evolution)
        return JSONResponse(status_code=200, content=data)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")


@api_temporal.get("/occurrence_by_age")
async def occurrence_by_age(
    uf: Optional[str] = None,
    syndrome: Optional[str] = None,
    year: Optional[int] = None,
    evolution: Optional[str] = None,
):
    try:
        controller = TemporalController()
        data = controller.occurrence_by_age(uf, syndrome, year, evolution)
        return JSONResponse(status_code=200, content=data)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")


@api_temporal.get("/serie_rooling_average")
async def serie_rooling_average(
    uf: Optional[str] = None,
    syndrome: Optional[str] = None,
    year: Optional[int] = None,
    evolution: Optional[str] = None,
    granularity: Optional[str] = None,
):
    # Granularity: ['3D', '5D', '7D', '14D', '28D'], Default: '3D'
    try:
        controller = TemporalController()
        data = controller.serie_rooling_average(
            uf, syndrome, year, evolution, granularity
        )
        return JSONResponse(status_code=200, content=data)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")


@api_temporal.get("/serie_differentiation")
async def serie_differentiation(
    uf: Optional[str] = None,
    syndrome: Optional[str] = None,
    year: Optional[int] = None,
    evolution: Optional[str] = None,
    order: Optional[str] = None,
):
    # Order: [1, 2], Default: 1
    try:
        controller = TemporalController()
        data = controller.serie_differentiation(uf, syndrome, year, evolution, order)
        return JSONResponse(status_code=200, content=data)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")


@api_temporal.get("/serie_exponential_rooling_average")
async def serie_exponential_rooling_average(
    uf: Optional[str] = None,
    syndrome: Optional[str] = None,
    year: Optional[int] = None,
    evolution: Optional[str] = None,
    granularity: Optional[int] = None,
):
    # Granularity: [3, 5, 7, 14, 28], Default: 3
    try:
        controller = TemporalController()
        data = controller.serie_exponential_rooling_average(
            uf, syndrome, year, evolution, granularity
        )
        return JSONResponse(status_code=200, content=data)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")
