from typing import Optional
from fastapi import APIRouter, HTTPException, Response
from controllers.report_controller import ReportController

api_report = APIRouter()

@api_report.get("/report")
async def overview(
    uf: Optional[str] = None,
    syndrome: Optional[str] = None,
    year: Optional[int] = None,
    evolution: Optional[str] = None,
):
    try:
        controller = ReportController()

        report = controller.overview_report(uf, syndrome, year, evolution)

        headers = {
            "content-length": str(len(report.encode('utf-8'))),
            "content-disposition": 'attachment; filename="report.html"'
        }

        return Response(content=report, status_code=200,
                        media_type="application/octet-stream",
                        headers=headers)

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")
