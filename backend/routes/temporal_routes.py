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


@api_temporal.get("/correlogram")
async def correlogram(
    uf: Optional[str] = None,
    syndrome: Optional[str] = None,
    year: Optional[int] = None,
    evolution: Optional[str] = None,
    granularity: Optional[int] = None,
    diff_order: Optional[int] = None,
    num_lags: Optional[int] = None,
    alpha: Optional[int] = None,
):
    try:
        controller = TemporalController()
        data = controller.correlogram(
            uf,
            syndrome,
            year,
            evolution,
            granularity,
            diff_order,
            num_lags,
            alpha,
        )
        return JSONResponse(status_code=200, content=data)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")
    

@api_temporal.get("/serie_stl_decomposition")
async def serie_stl_decomposition(
    uf: Optional[str] = None,
    syndrome: Optional[str] = None,
    year: Optional[int] = None,
    evolution: Optional[str] = None,
    seasonal: Optional[int] = None,
):
    # seasonal: to be defined
    try:
        controller = TemporalController()
        data = controller.serie_stl_decomposition(
            uf, syndrome, year, evolution, seasonal
        )
        return JSONResponse(status_code=200, content=data)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")
    

@api_temporal.get("/serie_lag_plot")
async def serie_lag_plot(
    uf: Optional[str] = None,
    syndrome: Optional[str] = None,
    year: Optional[int] = None,
    evolution: Optional[str] = None,
    lag: Optional[int] = None,
):
    # lag: to be defined
    try:
        controller = TemporalController()
        data = controller.serie_lag_plot(
            uf, syndrome, year, evolution, lag
        )
        return JSONResponse(status_code=200, content=data)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")
