# Person Detection System for Proctored Exams

## Overview

This enhanced proctoring system now includes advanced person detection capabilities using TensorFlow.js and the COCO-SSD model. The system can detect when additional persons enter the camera frame during an assessment, providing real-time alerts and comprehensive analytics.

## Features

### 🔍 Real-time Person Detection
- **AI-powered detection**: Uses TensorFlow.js with COCO-SSD model for accurate person detection
- **Live bounding boxes**: Visual indicators showing detected persons with confidence scores
- **Person counting**: Tracks the number of persons in the frame in real-time

### ⚠️ Smart Alert System
- **Visual alerts**: Prominent warning messages when additional persons are detected
- **Sound alerts**: Audio notifications for immediate attention
- **Configurable duration**: Customizable alert display time
- **Non-intrusive**: Alerts don't interfere with exam progress

### 📊 Comprehensive Analytics
- **Detection logs**: Detailed history of all person detection events
- **Risk assessment**: Automatic risk level calculation based on detection patterns
- **Time analysis**: Identifies most active periods during the exam
- **Export functionality**: Download detection logs for review

### ⚙️ Customizable Settings
- **Detection sensitivity**: Adjustable confidence threshold (30% - 90%)
- **Detection frequency**: Configurable detection intervals (1-5 seconds)
- **Alert preferences**: Toggle visual and sound alerts independently
- **Alert duration**: Customizable alert display time (2-10 seconds)

## How It Works

### Detection Process
1. **Model Loading**: TensorFlow.js COCO-SSD model loads on component mount
2. **Continuous Monitoring**: Camera feed is analyzed every 2 seconds (configurable)
3. **Person Identification**: AI model identifies persons with confidence scores
4. **Change Detection**: System compares current person count with previous count
5. **Alert Triggering**: When additional persons are detected, alerts are triggered

### Alert System
- **Visual Alert**: Red warning banner appears with person count information
- **Sound Alert**: Short beep sound plays (if enabled)
- **Logging**: All events are recorded with timestamps and details
- **Auto-dismiss**: Alerts automatically disappear after configured duration

## Usage

### During Exam
1. **Camera Access**: Allow camera permissions when prompted
2. **Model Loading**: Wait for "Loading model..." to complete
3. **Person Count**: Monitor the "Persons detected" counter
4. **Alerts**: Pay attention to warning messages if they appear
5. **Analytics**: Click "Show Analytics" to view detection history

### Settings Configuration
1. **Access Settings**: Click the "Settings" button in the top-left panel
2. **Adjust Sensitivity**: Use the slider to set detection sensitivity
3. **Set Intervals**: Configure detection frequency and alert duration
4. **Toggle Alerts**: Enable/disable visual and sound alerts
5. **Save Changes**: Settings are automatically saved to localStorage

### Analytics Review
1. **View Analytics**: Click "Show Analytics" button
2. **Review Metrics**: Check total detections, average persons, risk level
3. **Export Data**: Click "Export Logs" to download detection history
4. **Clear Data**: Use "Clear Logs" to reset detection history

## Technical Details

### Dependencies
- `@tensorflow/tfjs`: Core TensorFlow.js library
- `@tensorflow-models/coco-ssd`: Pre-trained object detection model

### Performance Considerations
- **Model Size**: ~20MB initial download (cached after first load)
- **Processing**: Runs every 2 seconds by default (configurable)
- **Memory**: Minimal memory footprint during operation
- **CPU Usage**: Optimized for real-time performance

### Browser Compatibility
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

## Security Features

### Privacy Protection
- **Local Processing**: All detection happens in the browser
- **No Data Upload**: Detection results stay on the user's device
- **Optional Logging**: Users can disable logging if desired
- **Secure Storage**: Data stored in browser localStorage

### Detection Accuracy
- **Confidence Threshold**: Configurable minimum confidence (default: 70%)
- **False Positive Reduction**: High threshold reduces false alarms
- **Real-time Validation**: Continuous monitoring ensures accuracy

## Troubleshooting

### Common Issues

**Model Not Loading**
- Check internet connection (required for initial download)
- Refresh the page and try again
- Clear browser cache if issues persist

**No Person Detection**
- Ensure camera permissions are granted
- Check if camera is working in other applications
- Verify lighting conditions are adequate

**False Alerts**
- Adjust sensitivity threshold in settings
- Ensure camera is positioned correctly
- Check for reflections or shadows

**Performance Issues**
- Increase detection interval in settings
- Close other browser tabs
- Restart the application

### Best Practices

1. **Camera Setup**
   - Position camera to capture the entire workspace
   - Ensure good lighting conditions
   - Minimize background movement

2. **Settings Optimization**
   - Start with default settings
   - Adjust sensitivity based on environment
   - Test detection before starting exam

3. **Monitoring**
   - Keep analytics panel open during exam
   - Review detection logs regularly
   - Export data for record keeping

## Future Enhancements

### Planned Features
- **Face Recognition**: Identify specific individuals
- **Behavior Analysis**: Detect suspicious activities
- **Multi-camera Support**: Support for multiple camera feeds
- **Advanced Analytics**: Machine learning-based pattern recognition
- **Integration APIs**: Connect with external proctoring systems

### Performance Improvements
- **WebGL Acceleration**: GPU-accelerated detection
- **Model Optimization**: Smaller, faster detection models
- **Background Processing**: Non-blocking detection operations

## Support

For technical support or feature requests, please refer to the main project documentation or contact the development team.

---

**Note**: This person detection system is designed to enhance exam security while maintaining user privacy and system performance. All detection occurs locally and no personal data is transmitted to external servers. 