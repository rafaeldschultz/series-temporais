import os
from typing import Optional
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from controllers.report_controller import ReportController

api_report = APIRouter()

CACHE_DIR = "./.cache"
os.makedirs(CACHE_DIR, exist_ok=True)

@api_report.get("/report")
async def overview(
    uf: Optional[str] = None,
    syndrome: Optional[str] = None,
    year: Optional[int] = None,
    evolution: Optional[str] = None,
):
    try:
        request = "_".join([str(uf), str(syndrome), str(year), str(evolution)])
        cache_file = os.path.join(CACHE_DIR, f"{request}.html")

        if os.path.exists(cache_file):
            return FileResponse(path=cache_file, filename="report.html")

        else:

            controller = ReportController()

            report = controller.general_report(uf, syndrome, year, evolution)

            with open(cache_file, "w") as f:
                f.write(report)

            return FileResponse(path=cache_file, filename="report.html")

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")
