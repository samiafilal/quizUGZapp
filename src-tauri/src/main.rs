// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use sqlx::Sqlite;
use sqlx::migrate::MigrateDatabase;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use std::string::String;
use std::sync::Mutex;

struct Phase {
    phase: Mutex<i32>,
}
struct AddTeamURL {
    add_team_url: Mutex<String>,
}
struct GameState {
    game_state: Mutex<String>,
}

struct Question {
    question: Mutex<String>,
}
use tauri::State;


#[tauri::command]
fn phase(method: &str, state: State<Phase>) -> i32 {
    let mut phase = state.phase.lock().unwrap();

    match method {
        "get" => (),
        "increment" => {
            *phase = *phase + 1;
        },
        "decrement" => {
            *phase = *phase - 1;
        },
        "next_question" => {
            *phase = 2;
        },
        _ => ()
    }
    *phase
}

#[tauri::command]
fn add_team_url(method: &str, url: &str, state: State<AddTeamURL>) -> String {
    let mut add_team_url = state.add_team_url.lock().unwrap();
    match method {
        "get" => (),
        "set" => {
            *add_team_url = (*url).to_string();
        },
        _ => ()
    }
    (*add_team_url).clone()
}

#[tauri::command]
fn game_state(method: &str, game: &str, state: State<GameState>) -> String {
    let mut game_state = state.game_state.lock().unwrap();
    match method {
        "get" => (),
        "set" => {
            *game_state = (*game).to_string();
        },
        _ => ()
    }
    (*game_state).clone()
}

#[tauri::command]
fn question(method: &str, current_question: &str, state: State<Question>) -> String {
    let mut question = state.question.lock().unwrap();
    match method {
        "get" => (),
        "set" => {
            *question = (*current_question).to_string();
        },
        _ => ()
    }
    (*question).clone()
}



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
        sqlx::query("CREATE TABLE questions (id INTEGER PRIMARY KEY, question TEXT, answer1 TEXT, answer2 TEXT, answer3 TEXT, answer4 TEXT, correct_answer INTEGER,
            difficulty INTEGER, category_id INTEGER, favorite INTEGER, time INTEGER, FOREIGN KEY(category_id) REFERENCES categories(id))")
            .execute(&pool).await.unwrap();
        //create a table named categories with id and category columns
        sqlx::query("CREATE TABLE categories (id INTEGER PRIMARY KEY, category TEXT)")
            .execute(&pool).await.unwrap();
    }
    Result::Ok(true)
}

fn main(){
    tauri::Builder::default()
        .manage(Phase { phase: Mutex::new(0) })
        .manage(AddTeamURL { add_team_url: Mutex::new("".to_string()) })
        .manage(GameState { game_state: Mutex::new("[]".to_string()) })
        .manage(Question { question: Mutex::new("[]".to_string()) })
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_websocket::init())
        .invoke_handler(tauri::generate_handler![create_db_if_no_db,phase,add_team_url,game_state,question])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
