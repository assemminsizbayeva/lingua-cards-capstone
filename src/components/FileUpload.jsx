import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const FileUpload = ({
                        onUploadComplete,
                        maxSize = 5242880,
                        acceptedFormats = ['.csv', '.xlsx', '.xls', '.json']
                    }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [fileName, setFileName] = useState(null);

    const parseFileData = async (data, fileType) => {
        if (fileType.includes('csv') || fileType.includes('text')) {
            return new Promise((resolve, reject) => {
                Papa.parse(data, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        if (results.errors.length > 0) {
                            reject(new Error(results.errors[0].message));
                        }
                        resolve(results.data);
                    },
                    error: (error) => reject(error)
                });
            });
        } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            return XLSX.utils.sheet_to_json(worksheet);
        } else if (fileType.includes('json')) {
            return JSON.parse(data);
        }
        throw new Error('Unsupported file format');
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        setIsLoading(true);
        setError(null);
        setPreviewData([]);

        const file = acceptedFiles[0];
        setFileName(file.name);

        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const result = e.target?.result;
                const parsedData = await parseFileData(result, file.type);

                if (parsedData.length > 0) {
                    const requiredColumns = ['word', 'translation', 'language'];
                    const firstRow = parsedData[0];
                    const missingColumns = requiredColumns.filter(col => !firstRow.hasOwnProperty(col));

                    if (missingColumns.length > 0) {
                        throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
                    }
                }

                setPreviewData(parsedData.slice(0, 3));
                onUploadComplete(parsedData);

            } catch (err) {
                setError(`Error parsing file: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        reader.onerror = () => {
            setError('Error reading file');
            setIsLoading(false);
        };

        reader.readAsBinaryString(file);
    }, [onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/json': ['.json']
        },
        maxSize,
        multiple: false,
    });

    return (
        <div className="file-upload-container">
            <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'active' : ''} ${error ? 'error' : ''}`}
            >
                <input {...getInputProps()} />

                <div className="upload-content">
                    {isLoading ? (
                        <>
                            <div className="spinner"></div>
                            <p>Processing {fileName}...</p>
                        </>
                    ) : isDragActive ? (
                        <>
                            <Upload size={48} />
                            <p>Drop the file here...</p>
                        </>
                    ) : (
                        <>
                            <Upload size={48} />
                            <p><strong>Drag & drop</strong> or click to select file</p>
                            <small>Supports: {acceptedFormats.join(', ')} (Max {maxSize / 1024 / 1024}MB)</small>
                        </>
                    )}
                </div>
            </div>

            {fileName && !isLoading && !error && (
                <div className="file-info success">
                    <CheckCircle size={16} />
                    <span>Loaded: {fileName} ({previewData.length} rows detected)</span>
                </div>
            )}

            {error && (
                <div className="error-message">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {previewData.length > 0 && (
                <div className="preview-section">
                    <h4>Preview (First 3 rows):</h4>
                    <div className="preview-table">
                        <table>
                            <thead>
                            <tr>
                                {Object.keys(previewData[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {previewData.map((row, idx) => (
                                <tr key={idx}>
                                    {Object.values(row).map((value, cellIdx) => (
                                        <td key={cellIdx}>{value || '-'}</td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;