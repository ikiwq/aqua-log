use tokio::sync::OnceCell;

pub mod db;

pub async fn init_prod() {
    static INIT: OnceCell<()> = OnceCell::const_new();

    INIT.get_or_init(|| async {
        db::init_prod_db().await.unwrap();
    })
    .await;
}
