import React, { useState, useRef } from 'react';
import {
  Upload as UploadIcon,
  Camera,
  FileImage,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { postJSON } from '../api';
import { isAuthenticated } from '../lib/actions/authActions';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Upload = () => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log(isAuthenticated());
    if(!isAuthenticated()){
      toast.error("Please login First");
      navigate('/login')
    }   
  }, [])
  
  const { t } = useLanguage();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  // Convert file to Base64 without prefix
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // const analyzeImage = async () => {
  //   if (!selectedFile) return;

  //   setIsAnalyzing(true);
  //   setAnalysisResult(null);

  //   try {
  //     const base64Image = await fileToBase64(selectedFile);
  //     const response = await postJSON('/advisory/detect-crop-disease', {
  //       base64Image,
  //       mimeType: selectedFile.type,
  //     });

  //     console.log('Analysis response:', response);
  //     setAnalysisResult(response)
   
  //     const data = response;
  //     // if(data){
  //     //   try {
  //     //     // Assuming the backend returns a JSON string or object with disease info
  //     //     const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
  //     //     setAnalysisResult(parsed);
  //     //   } catch {
  //     //     setAnalysisResult({ disease: data.result });
  //     //   }
  //     // } else {
  //     //   setAnalysisResult({ disease: data.error || 'Unable to analyze image' });
  //     // }
  //   } catch (error) {
  //     setAnalysisResult({ disease: 'Network error: ' + error.message });
  //   } finally {
  //     setIsAnalyzing(false);
  //   }
  // };

  const analyzeImage = async () => {
  if (!selectedFile) return;

  setIsAnalyzing(true);
  setAnalysisResult(null);

  try {
    const formData = new FormData();
    formData.append('image', selectedFile); // 'image' is the key your backend expects

    // Use fetch or axios with multipart/form-data
    const response = await fetch('http://localhost:5000/api/advisory/detect-crop-disease', {
      method: 'POST',
      body: formData,      
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    setAnalysisResult(result);
  } catch (error) {
    setAnalysisResult({ disease: 'Network error: ' + error.message });
  } finally {
    setIsAnalyzing(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('uploadTitle')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('uploadSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Image</h2>

            {!previewUrl ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />

                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop your image here or click to browse
                </p>

                <p className="text-sm text-gray-500 mb-4">Supports JPG, PNG, WEBP up to 10MB</p>

                <div className="flex justify-center space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Camera className="h-4 w-4" />
                    <span>Take Photo</span>
                  </button>

                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <FileImage className="h-4 w-4" />
                    <span>Choose File</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img src={previewUrl} alt="Uploaded crop" className="w-full h-64 object-cover rounded-lg" />

                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedFile(null);
                      setAnalysisResult(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile?.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4" />
                        <span>Analyze Image</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Analysis Results</h2>

            {!analysisResult && !isAnalyzing && (
              <div className="text-center py-12">
                <FileImage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Upload an image to get AI-powered analysis</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-12">
                <Loader className="h-16 w-16 text-green-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Analyzing your crop image...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-6">
                {/* Disease Section */}
                <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-900">Disease Detected</h3>
                  </div>
                  <p className="text-lg font-bold text-orange-900 mb-1">
                    {analysisResult.disease}
                  </p>
                  <p className="text-sm text-orange-700">
                    Confidence: {analysisResult.confidence}%
                    {' '}| Severity: {analysisResult.severity}
                  </p>
                </div>

                {/* Treatments */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Treatment Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.treatment?.map((step, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-gray-700 text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prevention */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Prevention Tips</h3>
                  <ul className="space-y-2">
                    {analysisResult.prevention?.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2"></span>
                        <span className="text-gray-700 text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
