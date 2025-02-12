import logging
import os
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
app = Flask(__name__)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.secret_key = "your-secret-key-here"

# Initialize SQLAlchemy with app
db.init_app(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/posts')
def posts():
    try:
        posts = Post.query.limit(10).all()
        return render_template('posts.html', posts=posts)
    except Exception as e:
        logger.error(f"Error fetching posts: {e}")
        return render_template('posts.html', error="Failed to load posts")

@app.route('/users')
def users():
    try:
        users = User.query.all()
        return render_template('users.html', users=users)
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
        return render_template('users.html', error="Failed to load users")

@app.route('/api/post/<int:post_id>')
def get_post(post_id):
    try:
        post = Post.query.get_or_404(post_id)
        return render_template('partials/post_item.html', post=post)
    except Exception as e:
        logger.error(f"Error fetching post {post_id}: {e}")
        return "Failed to load post", 500

@app.route('/api/user/<int:user_id>')
def get_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        return render_template('partials/user_card.html', user=user)
    except Exception as e:
        logger.error(f"Error fetching user {user_id}: {e}")
        return "Failed to load user", 500

# Create tables within application context
with app.app_context():
    from models import User, Post  # Import models
    db.create_all()  # Create tables