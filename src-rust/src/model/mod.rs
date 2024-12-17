use chrono::Utc;
use serde::Serialize;

use crate::database::db::{new_db_pool, Db};

#[derive(Clone, Debug, Serialize)]
pub struct VisitCreationResponse {
  pub device_id: String,
  pub visits_count: u64,
}

#[derive(Clone)]
pub struct ModelController {
  db: Db,
}

impl ModelController {
  pub async fn new() -> Result<Self, Box<dyn std::error::Error>> {
    let db = new_db_pool().await?;

    Ok(ModelController { db })
  }

  pub async fn create_visit(
    &self,
    device_id: String,
  ) -> Result<VisitCreationResponse, sqlx::error::Error> {
    sqlx::query("INSERT INTO visits (device_id) VALUES ($1)")
      .bind(&device_id)
      .execute(&self.db)
      .await?;

    let since_timestamp = Utc::now() - chrono::Duration::hours(24);
    let count: u64 =
      sqlx::query_scalar("SELECT COUNT(*) FROM visits WHERE device_id = $1 AND created_at > $2")
        .bind(&device_id)
        .bind(since_timestamp.to_rfc3339())
        .fetch_one(&self.db)
        .await?;

    return Ok(VisitCreationResponse {
      device_id,
      visits_count: count,
    });
  }
}
