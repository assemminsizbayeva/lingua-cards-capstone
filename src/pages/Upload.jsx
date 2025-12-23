import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { cardAPI } from '../api/cards';
import { authAPI } from '../api/auth';
import { Upload, AlertCircle, CheckCircle, Download } from 'lucide-react';

const UploadPage = () => {
    const [uploadStatus, setUploadStatus] = useState('idle');
    const [uploadResult, setUploadResult] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const navigate = useNavigate();

    const user = authAPI.getCurrentUser();

    const validateCards = (cards) => {
        const errors = [];
        const requiredFields = ['word', 'translation', 'language'];

        cards.forEach((card, index) => {
            requiredFields.forEach(field => {
                if (!card[field] || String(card[field]).trim() === '') {
                    errors.push(`Row ${index + 2}: Missing "${field}"`);
                }
            });

            if (card.language && card.language.length > 50) {
                errors.push(`Row ${index + 2}: Language name too long`);
            }

            if (card.type && !['noun', 'verb', 'adjective', 'phrase', 'other'].includes(card.type.toLowerCase())) {
                errors.push(`Row ${index + 2}: Invalid type "${card.type}". Must be: noun, verb, adjective, phrase, other`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
            stats: {
                total: cards.length,
                nouns: cards.filter(c => c.type?.toLowerCase() === 'noun').length,
                verbs: cards.filter(c => c.type?.toLowerCase() === 'verb').length,
                adjectives: cards.filter(c => c.type?.toLowerCase() === 'adjective').length,
                others: cards.filter(c => !c.type || !['noun', 'verb', 'adjective', 'phrase'].includes(c.type.toLowerCase())).length,
            }
        };
    };

    const handleUploadComplete = async (parsedData) => {
        setUploadStatus('validating');
        setValidationErrors([]);

        const validation = validateCards(parsedData);

        if (!validation.isValid) {
            setUploadStatus('error');
            setUploadResult({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
            return;
        }

        setUploadResult({
            success: true,
            message: 'Ready to upload',
            stats: validation.stats,
            data: parsedData
        });

        const shouldUpload = window.confirm(
            `Upload ${validation.stats.total} cards?\n` +
            `• Nouns: ${validation.stats.nouns}\n` +
            `• Verbs: ${validation.stats.verbs}\n` +
            `• Adjectives: ${validation.stats.adjectives}\n` +
            `• Others: ${validation.stats.others}`
        );

        if (!shouldUpload) {
            setUploadStatus('idle');
            return;
        }

        const cardsToUpload = parsedData.map(card => ({
            ...card,
            userId: user?.id || 'demo',
            learned: false,
            nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            intervalIndex: 0,
            difficulty: 'medium'
        }));

        setUploadStatus('uploading');

        try {
            const result = await cardAPI.batchCreateCards(cardsToUpload);
            setUploadStatus('success');
            setUploadResult(result);

            setTimeout(() => {
                navigate('/cards');
            }, 3000);

        } catch (error) {
            setUploadStatus('error');
            setUploadResult({
                success: false,
                message: error.message || 'Upload failed'
            });
        }
    };

    const downloadTemplate = () => {
        const template = `word,translation,language,type,example,notes
libro,book,Spanish,noun,"Estoy leyendo un libro.","Masculine noun"
correr,to run,Spanish,verb,"Me gusta correr por la mañana.",Regular -er verb
feliz,happy,Spanish,adjective,"Estoy muy feliz hoy.",Common adjective
la maison,the house,French,noun,"J'habite dans une grande maison.",Feminine noun
manger,to eat,French,verb,"Nous mangeons ensemble.",Regular -er verb`;

        const blob = new Blob([template], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'flashcard-template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="upload-page">
            <div className="page-header">
                <h1><Upload size={28} /> Bulk Import Flashcards</h1>
                <p>Upload your vocabulary lists from Excel/CSV files</p>
            </div>

            <div className="upload-guide">
                <div className="guide-step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                        <h3>Prepare Your File</h3>
                        <p>Download our template or prepare your own CSV/Excel file</p>
                        <button onClick={downloadTemplate} className="btn-outline">
                            <Download size={16} /> Download Template
                        </button>
                    </div>
                </div>

                <div className="guide-step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                        <h3>Required Format</h3>
                        <div className="format-requirements">
                            <p><strong>Required columns:</strong> <code>word</code>, <code>translation</code>, <code>language</code></p>
                            <p><strong>Optional columns:</strong> <code>type</code>, <code>example</code>, <code>notes</code></p>
                            <p><strong>Supported types:</strong> noun, verb, adjective, phrase, other</p>
                        </div>
                    </div>
                </div>

                <div className="guide-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                        <h3>Upload & Review</h3>
                        <p>Drag & drop your file below. Review the preview before uploading.</p>
                    </div>
                </div>
            </div>

            <div className="upload-area">
                <FileUpload onUploadComplete={handleUploadComplete} />
            </div>

            {uploadStatus === 'validating' && (
                <div className="status-message info">
                    <div className="spinner small"></div>
                    <span>Validating file contents...</span>
                </div>
            )}

            {uploadStatus === 'uploading' && (
                <div className="status-message info">
                    <div className="spinner small"></div>
                    <span>Uploading flashcards to your collection...</span>
                </div>
            )}

            {uploadStatus === 'success' && uploadResult && (
                <div className="status-message success">
                    <CheckCircle size={20} />
                    <div>
                        <strong>Success!</strong>
                        <p>{uploadResult.message}</p>
                        {uploadResult.created && (
                            <p className="stats">
                                Created: {uploadResult.created} cards
                                {uploadResult.failed ? ` (${uploadResult.failed} failed)` : ''}
                            </p>
                        )}
                        <p className="redirect">Redirecting to cards page in 3 seconds...</p>
                    </div>
                </div>
            )}

            {uploadStatus === 'error' && (
                <div className="status-message error">
                    <AlertCircle size={20} />
                    <div>
                        <strong>Upload Failed</strong>
                        <p>{uploadResult?.message || 'An error occurred'}</p>
                        {validationErrors.length > 0 && (
                            <div className="error-list">
                                <p><strong>Validation errors:</strong></p>
                                <ul>
                                    {validationErrors.slice(0, 5).map((error, idx) => (
                                        <li key={idx}>{error}</li>
                                    ))}
                                    {validationErrors.length > 5 && (
                                        <li>... and {validationErrors.length - 5} more errors</li>
                                    )}
                                </ul>
                                <button
                                    className="btn-text"
                                    onClick={() => setValidationErrors([])}
                                >
                                    Clear errors
                                </button>
                            </div>
                        )}
                        <button
                            className="btn-outline"
                            onClick={() => {
                                setUploadStatus('idle');
                                setUploadResult(null);
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            <div className="example-section">
                <h3>Example CSV Format</h3>
                <div className="code-block">
          <pre>
{`word,translation,language,type,example,notes
libro,book,Spanish,noun,"Estoy leyendo un libro.","Masculine noun"
correr,to run,Spanish,verb,"Me gusta correr por la mañana.",Regular -er verb
feliz,happy,Spanish,adjective,"Estoy muy feliz hoy.",Common adjective`}
          </pre>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;