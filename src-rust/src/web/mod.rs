use axum::{
  http::{header, Method},
  Router,
};
use tower_http::cors::{Any, CorsLayer};

use crate::model::ModelController;

mod routes_visits;

pub async fn routes() -> Router {
  let mc = ModelController::new().await.unwrap();

  let cors_layer = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(vec![Method::GET, Method::POST])
    .allow_headers(vec![header::CONTENT_TYPE]);

  Router::new()
    .nest("/api/v1", routes_visits::routes(mc.clone()))
    .layer(cors_layer)
}
