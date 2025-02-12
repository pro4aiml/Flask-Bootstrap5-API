from app import app, db
from models import User, Post

def seed_database():
    # Clear existing data
    with app.app_context():
        # Create test users
        users = [
            User(
                name="John Doe",
                email="john@example.com",
                website="https://johndoe.com",
                phone="123-456-7890",
                company_name="Tech Corp"
            ),
            User(
                name="Jane Smith",
                email="jane@example.com",
                website="https://janesmith.com",
                phone="098-765-4321",
                company_name="Design Studio"
            )
        ]
        
        db.session.add_all(users)
        db.session.commit()

        # Create test posts
        posts = [
            Post(
                title="First Post",
                body="This is the first test post content.",
                user_id=users[0].id
            ),
            Post(
                title="Second Post",
                body="This is the second test post content.",
                user_id=users[0].id
            ),
            Post(
                title="Design Thoughts",
                body="Some thoughts about design and creativity.",
                user_id=users[1].id
            )
        ]
        
        db.session.add_all(posts)
        db.session.commit()

if __name__ == "__main__":
    seed_database()
    print("Database seeded successfully!")
