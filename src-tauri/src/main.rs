// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use sqlx::Sqlite;
use sqlx::migrate::MigrateDatabase;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use std::string::String;






#[tauri::command]
async fn create_db_if_no_db(app_handle: tauri::AppHandle) -> Result<bool, String>{
    let app_dir: std::path::PathBuf = app_handle.path_resolver().app_data_dir().expect("The app data directory should exist.");
    let sqlite_path_buf: std::path::PathBuf = app_dir.join("main.sqlite");
    let sqlite_path: &str = sqlite_path_buf.to_str().expect("The path should be a valid string.");
    println!("sqlite path: {}", sqlite_path);
    if !Sqlite::database_exists(sqlite_path).await.unwrap_or(false) {
        Sqlite::create_database(sqlite_path).await.unwrap();
        let pool= sqlx::sqlite::SqlitePool::connect(sqlite_path).await.unwrap();
        //create a table named questions with id and question columns, an integer for the difficulty and a foreign key to the categories table
        sqlx::query("CREATE TABLE questions (id INTEGER PRIMARY KEY, question TEXT, difficulty INTEGER, category_id INTEGER, FOREIGN KEY(category_id) REFERENCES categories(id))")
            .execute(&pool).await.unwrap();
        //create a table named categories with id and category columns
        sqlx::query("CREATE TABLE categories (id INTEGER PRIMARY KEY, category TEXT)")
            .execute(&pool).await.unwrap();

    }
    Result::Ok(true)
}

fn main(){
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![create_db_if_no_db])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
