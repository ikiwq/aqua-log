use axum::{
  extract::{Path, State},
  routing::post,
  Json, Router,
};

use crate::{
  error::{Error, Result},
  model::{ModelController, VisitCreationResponse},
};

pub fn routes(mc: ModelController) -> Router {
  Router::new()
    .route("/visits/:device_id", post(create_visit))
    .with_state(mc)
}

pub async fn create_visit(
  State(mc): State<ModelController>,
  Path(device_id): Path<String>,
) -> Result<Json<VisitCreationResponse>> {
  match mc.create_visit(device_id).await {
    Ok(res) => Ok(Json(res)),
    Err(_) => Err(Error::VisitCreationFail),
  }
}
