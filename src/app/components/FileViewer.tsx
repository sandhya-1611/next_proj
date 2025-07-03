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
  Chip,
  Tooltip
} from '@mui/material';
import { 
  VisibilityRounded,
  CloseRounded,
  DownloadRounded,
  FolderOpenRounded,
  ImageRounded,
  PictureAsPdfRounded,
  DescriptionRounded,
  AttachFileRounded
} from '@mui/icons-material';

interface FileData {
  name: string;
  url: string;
  type?: string;
}

interface FileViewerProps {
  files: FileData[];
  compact?: boolean;
}

const FileViewer: React.FC<FileViewerProps> = ({
  files,
  compact = false
}) => {
  const [previewFile, setPreviewFile] = useState<FileData | null>(null);
  const [filesDialogOpen, setFilesDialogOpen] = useState(false);

  const handleFilePreview = (file: FileData) => {
    setPreviewFile(file);
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  const handleDownload = (file: FileData) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
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

  const getFileIcon = (type?: string) => {
    if (!type) return <AttachFileRounded fontSize="small" />;
    if (type.startsWith('image/')) return <ImageRounded fontSize="small" color="primary" />;
    if (type === 'application/pdf') return <PictureAsPdfRounded fontSize="small" color="error" />;
    if (type.includes('word') || type.includes('document')) return <DescriptionRounded fontSize="small" color="info" />;
    return <AttachFileRounded fontSize="small" />;
  };

  if (!files || files.length === 0) {
    return compact ? <span>-</span> : <Typography color="textSecondary">No files</Typography>;
  }

  // Render the main preview dialog regardless of compact mode
  const previewDialog = (
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
            {previewFile.type && previewFile.type.startsWith('image/') ? (
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
                  startIcon={<DownloadRounded />}
                  style={{ marginTop: '20px' }}
                  onClick={() => handleDownload(previewFile)}
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
                  startIcon={<DownloadRounded />}
                  style={{ marginTop: '20px' }}
                  onClick={() => handleDownload(previewFile)}
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
  );

  if (compact) {
    return (
      <>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip 
            label={`${files.length} file${files.length > 1 ? 's' : ''}`} 
            size="small" 
            color="primary"
            variant="outlined"
            icon={<FolderOpenRounded />}
            onClick={() => setFilesDialogOpen(true)}
            style={{ cursor: 'pointer' }}
          />
          
          {/* Files Dialog */}
          <Dialog 
            open={filesDialogOpen} 
            onClose={() => setFilesDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                Attached Files ({files.length})
                <IconButton onClick={() => setFilesDialogOpen(false)}>
                  <CloseRounded />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <List>
                {files.map((file, index) => (
                  <ListItem 
                    key={index}
                    style={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '4px', 
                      marginBottom: '8px' 
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          {getFileIcon(file.type)}
                          <span>{file.name}</span>
                        </Box>
                      }
                      secondary={`Size: ${formatFileSize(getFileSizeFromBase64(file.url))} • Type: ${file.type || 'Unknown'}`}
                    />
                    <Tooltip title="Preview">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleFilePreview(file)}
                        size="small"
                      >
                        <VisibilityRounded />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton 
                        color="default" 
                        onClick={() => handleDownload(file)}
                        size="small"
                      >
                        <DownloadRounded />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setFilesDialogOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Box>
        {previewDialog}
      </>
    );
  }

  // Full view (non-compact)
  return (
    <>
      <Box>
        <Typography variant="h6" gutterBottom>Attached Files ({files.length})</Typography>
        <List>
          {files.map((file, index) => (
            <ListItem 
              key={index}
              style={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: '4px', 
                marginBottom: '8px' 
              }}
            >
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    {getFileIcon(file.type)}
                    <span>{file.name}</span>
                  </Box>
                }
                secondary={`Size: ${formatFileSize(getFileSizeFromBase64(file.url))} • Type: ${file.type || 'Unknown'}`}
              />
              <Tooltip title="Preview">
                <IconButton 
                  color="primary" 
                  onClick={() => handleFilePreview(file)}
                >
                  <VisibilityRounded />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download">
                <IconButton 
                  color="default" 
                  onClick={() => handleDownload(file)}
                >
                  <DownloadRounded />
                </IconButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>
      {previewDialog}
    </>
  );
};

export default FileViewer; 