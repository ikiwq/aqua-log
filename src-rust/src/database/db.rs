use std::{fs, path::Path, time::Duration};

use sqlx::{migrate::MigrateDatabase, sqlite::SqlitePoolOptions, Pool, Sqlite};

pub type Db = Pool<Sqlite>;

const SL_PROD_DB_DIR: &str = "./data";
const SL_PROD_DB_URL: &str = "sqlite://data/prod.db";

const SQL_CREATE_SCHEMA: &str = "./sql/prod_initial/00-create-schema.sql";

pub async fn init_prod_db() -> Result<(), Box<dyn std::error::Error>> {
  if !Path::new(SL_PROD_DB_DIR).is_dir() {
    create_data_directory()?;
  }

  Sqlite::create_database(SL_PROD_DB_URL).await?;

  let app_db = new_db_pool().await?;
  lexec(&app_db, SQL_CREATE_SCHEMA).await?;
  app_db.close().await;

  Ok(())
}

fn create_data_directory() -> Result<(), Box<dyn std::error::Error>> {
  match fs::create_dir(SL_PROD_DB_DIR) {
    Ok(_) => Ok(()),
    Err(e) => Err(Box::new(e)),
  }
}

async fn lexec(db: &Db, file: &str) -> Result<(), Box<dyn std::error::Error>> {
  let content;
  match fs::read_to_string(file) {
    Ok(c) => content = c,
    Err(e) => {
      return Err(Box::new(e));
    }
  }

  let sql_statements: Vec<&str> = content.split(";").collect();
  for sql_statement in sql_statements {
    match sqlx::query(sql_statement).execute(db).await {
      Ok(_) => {}
      Err(e) => {
        return Err(Box::new(e));
      }
    }
  }

  Ok(())
}

pub async fn new_db_pool() -> Result<Db, sqlx::Error> {
  SqlitePoolOptions::new()
    .max_connections(1)
    .acquire_timeout(Duration::from_millis(500))
    .connect(SL_PROD_DB_URL)
    .await
}
