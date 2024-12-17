mod database;
mod error;
mod model;
mod web;

#[tokio::main]
async fn main() {
  database::init_prod().await;

  let app = web::routes().await;

  let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
    .await
    .unwrap();

  let _ = axum::serve(listener, app).await;
}
