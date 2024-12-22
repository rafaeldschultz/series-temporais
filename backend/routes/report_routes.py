import base64
import os
import tempfile
from typing import Optional

from controllers.report_controller import ReportController
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

api_report = APIRouter()


@api_report.get("/report")
async def report(
    uf: Optional[str] = None,
    syndrome: Optional[str] = None,
    year: Optional[int] = None,
    evolution: Optional[str] = None,
):
    try:
        controller = ReportController()
        file_bytes = controller.general_report(uf, syndrome, year, evolution)

        return JSONResponse(
            content=file_bytes,
            status_code=200,
        )

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")
