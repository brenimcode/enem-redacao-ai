from db.database import init_db

if __name__ == "__main__":
    print("Criando tabelas no banco de dados...")
    init_db()
    print("Tabelas criadas com sucesso!")