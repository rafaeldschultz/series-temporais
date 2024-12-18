import warnings

import uvicorn
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.raw_data_routes import api_raw
from routes.temporal_routes import api_temporal

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")

api.include_router(api_temporal)
api.include_router(api_raw)
app.include_router(api)

if __name__ == "__main__":
    warnings.simplefilter(action="ignore", category=FutureWarning)
    uvicorn.run(app, port=8000, host="0.0.0.0")
