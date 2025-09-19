<?php
/**
 * User Dashboard
 * 
 * Protected page for authenticated users
 */

require_once 'config.php';

// Check if user is logged in
requireAuth();

$username = $_SESSION['username'];
$email = $_SESSION['email'];
$loginTime = date('Y-m-d H:i:s', $_SESSION['login_time']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Comiflix</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Roboto', sans-serif;
            background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%);
            min-height: 100vh;
            color: white;
        }

        .header {
            background: rgba(0, 0, 0, 0.8);
            padding: 20px 0;
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }

        .header-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo h1 {
            font-family: 'Orbitron', monospace;
            font-size: 2rem;
            background: linear-gradient(45deg, #00d4ff, #ff6b35);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 900;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(45deg, #00d4ff, #ff6b35);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
        }

        .logout-btn {
            background: linear-gradient(45deg, #ff6b35, #ff0000);
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            color: white;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 500;
        }

        .logout-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 107, 53, 0.4);
        }

        .dashboard-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .welcome-section {
            text-align: center;
            margin-bottom: 50px;
        }

        .welcome-section h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #00d4ff, #ff6b35);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .welcome-section p {
            font-size: 1.2rem;
            color: #ccc;
            max-width: 600px;
            margin: 0 auto;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-bottom: 50px;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 212, 255, 0.2);
        }

        .stat-icon {
            font-size: 3rem;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #00d4ff, #ff6b35);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 10px;
            color: #00d4ff;
        }

        .stat-label {
            color: #ccc;
            font-size: 1.1rem;
        }

        .actions-section {
            margin-bottom: 50px;
        }

        .section-title {
            font-size: 2rem;
            margin-bottom: 30px;
            text-align: center;
            color: #00d4ff;
        }

        .actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }

        .action-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }

        .action-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(255, 107, 53, 0.2);
        }

        .action-card h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: #ff6b35;
        }

        .action-card p {
            color: #ccc;
            margin-bottom: 20px;
            line-height: 1.6;
        }

        .action-btn {
            background: linear-gradient(45deg, #00d4ff, #ff6b35);
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
            font-weight: 500;
        }

        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 212, 255, 0.4);
        }

        .recent-activity {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .activity-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .activity-item:last-child {
            border-bottom: none;
        }

        .activity-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(45deg, #00d4ff, #ff6b35);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .activity-text {
            flex: 1;
        }

        .activity-time {
            color: #999;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .header-container {
                flex-direction: column;
                gap: 20px;
            }

            .welcome-section h1 {
                font-size: 2rem;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .actions-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-container">
            <div class="logo">
                <h1>Comiflix</h1>
            </div>
            <div class="user-info">
                <div class="user-avatar">
                    <?php echo strtoupper(substr($username, 0, 1)); ?>
                </div>
                <span>Welcome, <?php echo htmlspecialchars($username); ?>!</span>
                <a href="logout.php" class="logout-btn">Logout</a>
            </div>
        </div>
    </header>

    <div class="dashboard-container">
        <div class="welcome-section">
            <h1>Welcome to Your Dashboard</h1>
            <p>Explore the cosmos of AI-driven dialogues and manage your Comiflix experience.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-play-circle"></i>
                </div>
                <div class="stat-number">12</div>
                <div class="stat-label">Episodes Watched</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="stat-number">8</div>
                <div class="stat-label">Favorites</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="stat-number">24</div>
                <div class="stat-label">Comments Made</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="stat-number">Gold</div>
                <div class="stat-label">Member Status</div>
            </div>
        </div>

        <div class="actions-section">
            <h2 class="section-title">Quick Actions</h2>
            <div class="actions-grid">
                <div class="action-card">
                    <h3><i class="fas fa-video"></i> Watch Latest Episode</h3>
                    <p>Dive into the newest AI dialogue exploring quantum consciousness and digital souls.</p>
                    <a href="index.html" class="action-btn">Watch Now</a>
                </div>
                <div class="action-card">
                    <h3><i class="fas fa-users"></i> Join Community</h3>
                    <p>Engage with fellow philosophy enthusiasts and share your thoughts on the latest debates.</p>
                    <a href="index.html" class="action-btn">Join Discussion</a>
                </div>
                <div class="action-card">
                    <h3><i class="fas fa-shopping-bag"></i> Explore Merchandise</h3>
                    <p>Support the channel and show your love for cosmic AI dialogues with exclusive merch.</p>
                    <a href="index.html" class="action-btn">Shop Now</a>
                </div>
                <div class="action-card">
                    <h3><i class="fas fa-blog"></i> Read Latest Blog</h3>
                    <p>Get behind-the-scenes insights into AI prompt engineering and philosophical debates.</p>
                    <a href="index.html" class="action-btn">Read More</a>
                </div>
            </div>
        </div>

        <div class="recent-activity">
            <h2 class="section-title">Recent Activity</h2>
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-play"></i>
                </div>
                <div class="activity-text">
                    <strong>Watched:</strong> "Quantum Faith: Entangled Souls"
                </div>
                <div class="activity-time">2 hours ago</div>
            </div>
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="activity-text">
                    <strong>Added to favorites:</strong> "Eternal AI: Recurrence in Code"
                </div>
                <div class="activity-time">1 day ago</div>
            </div>
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-comment"></i>
                </div>
                <div class="activity-text">
                    <strong>Commented on:</strong> "The Great AI Consciousness Debate"
                </div>
                <div class="activity-time">3 days ago</div>
            </div>
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-user-plus"></i>
                </div>
                <div class="activity-text">
                    <strong>Account created</strong> - Welcome to Comiflix!
                </div>
                <div class="activity-time"><?php echo $loginTime; ?></div>
            </div>
        </div>
    </div>
</body>
</html>