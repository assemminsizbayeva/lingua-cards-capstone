import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cardAPI } from '../api/cards';
import { authAPI } from '../api/auth';
import Flashcard from '../components/Flashcard';
import {
    BookOpen,
    CheckCircle,
    Clock,
    TrendingUp,
    PlusCircle,
    Calendar,
    Target
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalCards: 0,
        learnedCards: 0,
        dueToday: 0,
        streak: 0,
        recentActivity: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [recentCards, setRecentCards] = useState([]);
    const [dueCards, setDueCards] = useState([]);

    const user = authAPI.getCurrentUser();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const allCards = await cardAPI.getAllCards(user?.id || 'demo');
            const dueForReview = await cardAPI.getDueForReview(user?.id || 'demo');

            const total = allCards.length;
            const learned = allCards.filter(card => card.learned).length;
            const dueToday = dueForReview.length;

            setStats({
                totalCards: total,
                learnedCards: learned,
                dueToday,
                streak: user?.stats?.streak || 0,
                recentActivity: []
            });

            setRecentCards(allCards.slice(0, 3));
            setDueCards(dueForReview.slice(0, 3));

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkLearned = async (cardId) => {
        try {
            await cardAPI.updateCard(cardId, { learned: true });
            fetchDashboardData();
        } catch (error) {
            console.error('Failed to mark card as learned:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading your learning dashboard...</p>
            </div>
        );
    }

    const progressPercentage = stats.totalCards > 0
        ? Math.round((stats.learnedCards / stats.totalCards) * 100)
        : 0;

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Welcome back, {user?.name || 'Learner'}!</h1>
                <p>Continue your language learning journey</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon total">
                        <BookOpen size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalCards}</h3>
                        <p>Total Cards</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon learned">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.learnedCards}</h3>
                        <p>Learned</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon due">
                        <Clock size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.dueToday}</h3>
                        <p>Due Today</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon streak">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.streak} days</h3>
                        <p>Streak</p>
                    </div>
                </div>
            </div>

            <div className="progress-section">
                <div className="progress-header">
                    <h2>Learning Progress</h2>
                    <span>{progressPercentage}%</span>
                </div>
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <p className="progress-text">
                    {stats.learnedCards} of {stats.totalCards} cards mastered
                </p>
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/upload" className="action-card primary">
                        <PlusCircle size={32} />
                        <h3>Import Cards</h3>
                        <p>Upload vocabulary from file</p>
                    </Link>

                    <Link to="/review" className="action-card accent">
                        <Target size={32} />
                        <h3>Start Review</h3>
                        <p>{stats.dueToday} cards waiting</p>
                    </Link>

                    <Link to="/cards" className="action-card">
                        <BookOpen size={32} />
                        <h3>Browse Cards</h3>
                        <p>View all your flashcards</p>
                    </Link>

                    <Link to="/cards/new" className="action-card">
                        <PlusCircle size={32} />
                        <h3>Add Card</h3>
                        <p>Create a single flashcard</p>
                    </Link>
                </div>
            </div>

            {dueCards.length > 0 && (
                <div className="due-today-section">
                    <div className="section-header">
                        <h2>Cards Due for Review</h2>
                        <Link to="/review" className="btn-text">
                            Review All ({stats.dueToday}) →
                        </Link>
                    </div>
                    <div className="cards-preview">
                        {dueCards.map(card => (
                            <div key={card.id} className="preview-card">
                                <Flashcard
                                    card={card}
                                    onMarkLearned={handleMarkLearned}
                                    showActions={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="recent-cards">
                <div className="section-header">
                    <h2>Recently Added</h2>
                    <Link to="/cards" className="btn-text">
                        View All →
                    </Link>
                </div>
                <div className="cards-grid">
                    {recentCards.map(card => (
                        <Flashcard
                            key={card.id}
                            card={card}
                            onMarkLearned={handleMarkLearned}
                        />
                    ))}
                </div>
            </div>

            <div className="daily-goal">
                <div className="goal-content">
                    <Calendar size={24} />
                    <div>
                        <h3>Daily Goal</h3>
                        <p>Review at least 10 cards today to maintain your streak!</p>
                    </div>
                </div>
                <div className="goal-progress">
                    <span>{Math.min(stats.dueToday, 10)}/10</span>
                    <div className="goal-dots">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className={`goal-dot ${i < Math.min(stats.dueToday, 10) ? 'completed' : ''}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;