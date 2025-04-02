import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentAnalysis = ({ reviews }) => {
  const [sentimentData, setSentimentData] = useState({
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#4caf50', '#9e9e9e', '#f44336'],
        hoverBackgroundColor: ['#66bb6a', '#bdbdbd', '#e57373'],
      },
    ],
  });
  
  const [keyInsights, setKeyInsights] = useState([]);
  
  useEffect(() => {
    if (!reviews || reviews.length === 0) {
      setSentimentData({
        ...sentimentData,
        datasets: [{ ...sentimentData.datasets[0], data: [0, 0, 0] }],
      });
      setKeyInsights([]);
      return;
    }
    
    // Count sentiments
    const counts = {
      Positive: reviews.filter(r => r.sentiment?.label === 'Positive').length,
      Neutral: reviews.filter(r => r.sentiment?.label === 'Neutral').length,
      Negative: reviews.filter(r => r.sentiment?.label === 'Negative').length,
    };
    
    // Update chart data
    setSentimentData({
      ...sentimentData,
      datasets: [{ ...sentimentData.datasets[0], data: [counts.Positive, counts.Neutral, counts.Negative] }],
    });
    
    // Calculate key insights
    const insights = [];
    
    // Total sentiment percentage
    const total = reviews.length;
    const positivePercentage = (counts.Positive / total * 100).toFixed(0);
    insights.push(`${positivePercentage}% of your reviews are positive`);
    
    // Recent trend
    const recentReviews = [...reviews]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    const recentPositive = recentReviews.filter(r => r.sentiment?.label === 'Positive').length;
    const recentNegative = recentReviews.filter(r => r.sentiment?.label === 'Negative').length;
    
    if (recentPositive > recentNegative) {
      insights.push('Recent reviews trend is positive');
    } else if (recentNegative > recentPositive) {
      insights.push('Recent reviews trend is negative');
    } else {
      insights.push('Recent reviews are mixed');
    }
    
    // Low rating areas to improve
    const lowRatings = reviews.filter(r => r.rating <= 2);
    if (lowRatings.length > 0) {
      insights.push(`${lowRatings.length} reviews have low ratings (1-2 stars)`);
    }
    
    // Response rate
    const respondedCount = reviews.filter(r => r.responses && r.responses.length > 0).length;
    const responseRate = (respondedCount / total * 100).toFixed(0);
    insights.push(`${responseRate}% of reviews have been responded to`);
    
    setKeyInsights(insights);
  }, [reviews]);
  
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <h5>Sentiment Analysis</h5>
        
        <Row>
          <Col md={6} className="d-flex align-items-center justify-content-center" style={{ height: '220px' }}>
            {reviews && reviews.length > 0 ? (
              <Pie 
                data={sentimentData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = total ? Math.round((value / total) * 100) : 0;
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            ) : (
              <div className="text-center text-muted p-5">
                <p>No review data available</p>
              </div>
            )}
          </Col>
          
          <Col md={6}>
            <h6>Key Insights</h6>
            {keyInsights.length > 0 ? (
              <ul className="ps-4 mt-2">
                {keyInsights.map((insight, index) => (
                  <li key={index} className="mb-2">{insight}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No insights available</p>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SentimentAnalysis;