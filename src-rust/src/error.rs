use axum::{
  http::StatusCode,
  response::{IntoResponse, Response},
};
use serde::Serialize;

pub type Result<T> = core::result::Result<T, Error>;

#[derive(Clone, Debug, Serialize)]
#[serde(tag = "type", content = "data")]
pub enum Error {
  VisitCreationFail,
}

impl IntoResponse for Error {
  fn into_response(self) -> Response {
    let mut response = StatusCode::INTERNAL_SERVER_ERROR.into_response();

    response.extensions_mut().insert(self);
    response
  }
}
