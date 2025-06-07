from fastapi.testclient import TestClient
import pytest
from sqlalchemy.orm import Session

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app
from app.core.config import settings
from app.models.user import Role
from app.services.user import create_user
from app.schemas.user import UserCreate

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_login(db: Session):
    # Crear un usuario para pruebas
    user_in = UserCreate(
        email="test_login@example.com",
        password="testpassword",
        is_active=True,
        role=Role.ADMIN
    )
    create_user(db, user_in=user_in)
    
    # Probar login exitoso
    login_data = {
        "username": "test_login@example.com",
        "password": "testpassword",
    }
    response = client.post(f"{settings.API_V1_PREFIX}/auth/login", data=login_data)
    
    assert response.status_code == 200
    tokens = response.json()
    assert "access_token" in tokens
    assert tokens["token_type"] == "bearer"
    
    # Probar login con credenciales incorrectas
    login_data = {
        "username": "test_login@example.com",
        "password": "wrongpassword",
    }
    response = client.post(f"{settings.API_V1_PREFIX}/auth/login", data=login_data)
    
    assert response.status_code == 401

def test_create_user(db: Session):
    # Crear un usuario administrador para obtener token
    admin_in = UserCreate(
        email="test_admin@example.com",
        password="testpassword",
        is_active=True,
        role=Role.ADMIN
    )
    create_user(db, user_in=admin_in)
    
    # Obtener token de administrador
    login_data = {
        "username": "test_admin@example.com",
        "password": "testpassword",
    }
    response = client.post(f"{settings.API_V1_PREFIX}/auth/login", data=login_data)
    tokens = response.json()
    admin_token = tokens["access_token"]
    
    # Crear un nuevo usuario usando el token de administrador
    new_user = {
        "email": "new_user@example.com",
        "password": "newpassword",
        "is_active": True,
        "role": "user"
    }
    
    response = client.post(
        f"{settings.API_V1_PREFIX}/users/",
        json=new_user,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == new_user["email"]
    assert data["is_active"] == new_user["is_active"]
    assert data["role"] == new_user["role"]
    assert "id" in data

def test_get_users(db: Session):
    # Crear un usuario administrador para obtener token
    admin_in = UserCreate(
        email="test_get_users@example.com",
        password="testpassword",
        is_active=True,
        role=Role.ADMIN
    )
    create_user(db, user_in=admin_in)
    
    # Obtener token de administrador
    login_data = {
        "username": "test_get_users@example.com",
        "password": "testpassword",
    }
    response = client.post(f"{settings.API_V1_PREFIX}/auth/login", data=login_data)
    tokens = response.json()
    admin_token = tokens["access_token"]
    
    # Obtener usuarios
    response = client.get(
        f"{settings.API_V1_PREFIX}/users/",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
