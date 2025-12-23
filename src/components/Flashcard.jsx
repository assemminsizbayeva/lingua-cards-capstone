import React, { useState } from 'react';
import { FlipHorizontal, Volume2, Bookmark, CheckCircle } from 'lucide-react';

const Flashcard = ({
                       card,
                       onFlip,
                       onMarkLearned,
                       showActions = true
                   }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleFlip = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setIsFlipped(!isFlipped);
        if (onFlip) onFlip();

        setTimeout(() => setIsAnimating(false), 300);
    };

    const getTypeColor = () => {
        const colors = {
            noun: 'bg-blue-100 border-blue-300',
            verb: 'bg-red-100 border-red-300',
            adjective: 'bg-green-100 border-green-300',
            phrase: 'bg-purple-100 border-purple-300',
            other: 'bg-gray-100 border-gray-300',
        };
        return colors[card.type] || colors.other;
    };

    const speakText = (text, lang) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang === 'Spanish' ? 'es-ES' :
                lang === 'French' ? 'fr-FR' :
                    lang === 'German' ? 'de-DE' : 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="flashcard-container">
            <div
                className={`flashcard ${isFlipped ? 'flipped' : ''} ${getTypeColor()}`}
                onClick={handleFlip}
            >
                <div className="flashcard-front">
                    <div className="flashcard-header">
            <span className={`type-badge ${card.type}`}>
              {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
            </span>
                        <span className="language-tag">{card.language}</span>
                        {card.learned && <CheckCircle className="learned-icon" />}
                    </div>

                    <div className="flashcard-content">
                        <h2 className="word">{card.word}</h2>
                        {card.example && (
                            <p className="example">
                                <em>"{card.example}"</em>
                            </p>
                        )}
                        <div className="hint">Click to flip →</div>
                    </div>

                    <div className="flashcard-footer">
                        {showActions && (
                            <>
                                <button
                                    className="icon-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        speakText(card.word, card.language);
                                    }}
                                    title="Listen pronunciation"
                                >
                                    <Volume2 size={20} />
                                </button>
                                <button
                                    className="icon-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFlip();
                                    }}
                                    title="Flip card"
                                >
                                    <FlipHorizontal size={20} />
                                </button>
                                {!card.learned && onMarkLearned && (
                                    <button
                                        className="icon-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onMarkLearned(card.id);
                                        }}
                                        title="Mark as learned"
                                    >
                                        <Bookmark size={20} />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="flashcard-back">
                    <div className="flashcard-header">
                        <span className="translation-label">Translation</span>
                    </div>

                    <div className="flashcard-content">
                        <h2 className="translation">{card.translation}</h2>
                        {card.notes && (
                            <div className="notes">
                                <strong>Notes:</strong> {card.notes}
                            </div>
                        )}
                        <div className="review-info">
                            <small>
                                Next review: {new Date(card.nextReview).toLocaleDateString()}
                            </small>
                        </div>
                    </div>

                    <div className="flashcard-footer">
                        <button
                            className="flip-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFlip();
                            }}
                        >
                            <FlipHorizontal size={20} /> Flip Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Flashcard;