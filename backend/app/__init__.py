from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # Bật CORS cho phép frontend truy cập backend
    CORS(app)

    # Cấu hình hoặc khởi tạo các phần khác của ứng dụng ở đây
    # Ví dụ: app.config.from_object(Config)
    
    # Import routes hoặc API views
    from . import server
    app.register_blueprint(server.app)

    return app
