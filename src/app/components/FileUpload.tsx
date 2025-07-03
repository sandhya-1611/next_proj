"use client"

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { 
  UploadFileRounded, 
  DeleteRounded, 
  VisibilityRounded,
  CloseRounded
} from '@mui/icons-material';

interface FileData {
  name: string;
  url: string;
  type: string;
}

interface FileUploadProps {
  files: FileData[];
  onFilesChange: (files: FileData[]) => void;
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedTypes?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizeInMB = 10,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx']
}) => {
  const [previewFile, setPreviewFile] = useState<FileData | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setError('');

    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles: FileData[] = [];

    selectedFiles.forEach((file) => {
      // Check file size
      if (file.size > maxSizeInMB * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is ${maxSizeInMB}MB`);
        return;
      }

      // Check file type
      const isValidType = acceptedTypes.some(type => {
        if (type.includes('*')) {
          return file.type.startsWith(type.split('*')[0]);
        }
        return file.name.toLowerCase().endsWith(type.toLowerCase()) || file.type === type;
      });

      if (!isValidType) {
        setError(`File ${file.name} is not an accepted file type`);
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const newFile: FileData = {
          name: file.name,
          url: base64String,
          type: file.type
        };
        
        validFiles.push(newFile);
        
        if (validFiles.length === selectedFiles.length) {
          onFilesChange([...files, ...validFiles]);
        }
      };
      
      reader.readAsDataURL(file);
    });

    // Reset input
    event.target.value = '';
  };

  const handleFileDelete = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
  };

  const handleFilePreview = (file: FileData) => {
    setPreviewFile(file);
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileSizeFromBase64 = (base64String: string) => {
    // Remove data URL prefix if present
    const base64Data = base64String.includes(',') ? base64String.split(',')[1] : base64String;
    // Calculate approximate size (base64 is ~4/3 larger than original)
    return Math.round((base64Data.length * 3) / 4);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="10px">
        <Typography variant="h6">Treatment Files</Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadFileRounded />}
          disabled={files.length >= maxFiles}
        >
          Upload Files
          <input
            type="file"
            hidden
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
          />
        </Button>
      </Box>

      {error && (
        <Alert severity="error" style={{ marginBottom: '10px' }}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="textSecondary" style={{ marginBottom: '10px' }}>
        Accepted formats: Images, PDF, Word documents. Max size: {maxSizeInMB}MB per file. 
        Max files: {maxFiles}
      </Typography>

      {files.length > 0 ? (
        <List>
          {files.map((file, index) => (
            <ListItem 
              key={index}
              style={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: '4px', 
                marginBottom: '5px' 
              }}
            >
              <ListItemText
                primary={file.name}
                secondary={`Size: ${formatFileSize(getFileSizeFromBase64(file.url))}`}
              />
              <IconButton 
                color="primary" 
                onClick={() => handleFilePreview(file)}
                title="Preview"
              >
                <VisibilityRounded />
              </IconButton>
              <IconButton 
                color="error" 
                onClick={() => handleFileDelete(index)}
                title="Delete"
              >
                <DeleteRounded />
              </IconButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="textSecondary" style={{ padding: '20px', textAlign: 'center' }}>
          No files uploaded yet. Click "Upload Files" to add treatment records.
        </Typography>
      )}

      {/* File Preview Dialog */}
      <Dialog 
        open={!!previewFile} 
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {previewFile?.name}
            <IconButton onClick={handleClosePreview}>
              <CloseRounded />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {previewFile && (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              {previewFile.type.startsWith('image/') ? (
                <img 
                  src={previewFile.url} 
                  alt={previewFile.name}
                  style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                />
              ) : previewFile.type === 'application/pdf' ? (
                <Box textAlign="center">
                  <Typography variant="h6" gutterBottom>PDF Document</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {previewFile.name}
                  </Typography>
                  <Button 
                    variant="contained" 
                    style={{ marginTop: '20px' }}
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = previewFile.url;
                      link.download = previewFile.name;
                      link.click();
                    }}
                  >
                    Download PDF
                  </Button>
                </Box>
              ) : (
                <Box textAlign="center">
                  <Typography variant="h6" gutterBottom>Document</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {previewFile.name}
                  </Typography>
                  <Typography variant="body2" style={{ marginTop: '10px' }}>
                    Preview not available for this file type.
                  </Typography>
                  <Button 
                    variant="contained" 
                    style={{ marginTop: '20px' }}
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = previewFile.url;
                      link.download = previewFile.name;
                      link.click();
                    }}
                  >
                    Download File
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileUpload; 