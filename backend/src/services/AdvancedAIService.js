// backend/src/services/AdvancedAIService.js
import { OpenAI } from 'openai';
import { ObjectDetectionService } from './ObjectDetectionService.js';
import { LayoutAnalysisService } from './LayoutAnalysisService.js';
import { VectorSearchService } from './VectorSearchService.js';
import { SafetyAnalysisService } from './SafetyAnalysisService.js';

export class AdvancedAIService {
  constructor() {
    this.openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000
    });
    this.objectDetection = new ObjectDetectionService();
    this.layoutAnalysis = new LayoutAnalysisService();
    this.vectorSearch = new VectorSearchService();
    this.safetyAnalysis = new SafetyAnalysisService();
  }

  async processRoomImage(imageBuffer, imageMetadata, userPreferences) {
    try {
      const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`Starting AI analysis ${analysisId}`);
      
      // Step 1: Parallel processing of detection and layout
      const [detectionResults, layoutResults] = await Promise.all([
        this.objectDetection.analyzeObjects(imageBuffer),
        this.layoutAnalysis.analyzeLayout(imageBuffer)
      ]);

      // Step 2: Safety analysis
      const safetyResults = await this.safetyAnalysis.analyzeSafety(
        detectionResults, 
        layoutResults
      );

      // Step 3: Space utilization analysis
      const spaceUtilization = this.analyzeSpaceUtilization(detectionResults, layoutResults);

      // Step 4: Generate embeddings for similarity search
      const sceneEmbedding = await this.generateSceneEmbedding(
        detectionResults, 
        layoutResults, 
        userPreferences
      );

      // Step 5: Get intelligent recommendations
      const recommendations = await this.generateRecommendations({
        detection: detectionResults,
        layout: layoutResults,
        safety: safetyResults,
        spaceUtilization,
        userPreferences,
        sceneEmbedding
      });

      return {
        analysisId,
        detection: detectionResults,
        layout: layoutResults,
        safety: safetyResults,
        spaceUtilization,
        recommendations,
        sceneEmbedding,
        processedAt: new Date(),
        analysisTime: Date.now() - analysisId.split('_')[1]
      };
    } catch (error) {
      console.error('Advanced AI processing failed:', error);
      throw new Error(`AI processing failed: ${error.message}`);
    }
  }

  async generateSceneEmbedding(detection, layout, userPreferences) {
    const sceneDescription = this.buildSceneDescription(detection, layout, userPreferences);
    
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-large",
        input: sceneDescription,
        encoding_format: "float"
      });

      return response.data[0].embedding;
    } catch (error) {
      console.warn('OpenAI embedding failed, using fallback:', error.message);
      return this.generateFallbackEmbedding(detection, layout);
    }
  }

  buildSceneDescription(detection, layout, userPreferences) {
    return `
Room Analysis for Organization Recommendations:

DETECTED OBJECTS:
- Furniture: ${detection.objects.filter(obj => obj.category === 'furniture').map(obj => obj.label).join(', ')}
- Clutter: ${detection.objects.filter(obj => obj.category === 'clutter').map(obj => obj.label).join(', ')}
- Storage: ${detection.objects.filter(obj => obj.category === 'storage').map(obj => obj.label).join(', ')}

ROOM LAYOUT:
- Dimensions: ${layout.dimensions.width}x${layout.dimensions.height}${layout.dimensions.unit}
- Clutter Zones: ${layout.clutterZones.length} areas with intensity ${layout.clutterZones.map(z => z.intensity).join(', ')}
- Furniture Placement: ${layout.furniturePlacement.length} items

USER PREFERENCES:
- Budget: ${userPreferences.budget}
- Style: ${userPreferences.style}
- DIY Level: ${userPreferences.diyLevel}/5
- Room Type: ${userPreferences.roomType}

ORGANIZATION GOALS:
Maximize space utilization, improve accessibility, enhance aesthetics, maintain safety.
`;
  }

  async generateRecommendations(analysisData) {
    const { detection, layout, safety, spaceUtilization, userPreferences, sceneEmbedding } = analysisData;

    // Get similar products via vector search
    const similarProducts = await this.vectorSearch.findSimilarProducts(
      sceneEmbedding, 
      userPreferences
    );

    // Generate intelligent recommendations using GPT-4
    const aiRecommendations = await this.generateAIRecommendations(
      detection, 
      layout, 
      userPreferences
    );

    // Generate DIY solutions
    const diySolutions = await this.generateDIYSolutions(
      detection, 
      layout, 
      userPreferences
    );

    // Generate layout optimization suggestions
    const layoutOptimizations = await this.generateLayoutOptimizations(
      layout, 
      detection, 
      userPreferences
    );

    return this.rankAndCombineRecommendations({
      products: similarProducts,
      aiSuggestions: aiRecommendations,
      diy: diySolutions,
      layout: layoutOptimizations,
      userPreferences
    });
  }

  async generateAIRecommendations(detection, layout, userPreferences) {
    const prompt = this.buildRecommendationPrompt(detection, layout, userPreferences);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "You are a professional home organization expert. Provide specific, actionable storage and organization recommendations."
        }, {
          role: "user",
          content: prompt
        }],
        max_tokens: 2000,
        temperature: 0.7
      });

      return this.parseAIResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('GPT-4 recommendation generation failed:', error);
      return this.generateFallbackRecommendations(detection, layout);
    }
  }

  buildRecommendationPrompt(detection, layout, userPreferences) {
    return `
Analyze this room and provide professional organization recommendations.

ROOM ANALYSIS:
- Detected Furniture: ${detection.objects.filter(o => o.category === 'furniture').map(o => o.label).join(', ')}
- Clutter Issues: ${layout.clutterZones.map(z => `${z.type} area (intensity: ${z.intensity}/10)`).join(', ')}
- Space Utilization: ${layout.spaceUtilization.efficiency}% efficient

USER CONSTRAINTS:
- Budget: ${userPreferences.budget}
- Preferred Style: ${userPreferences.style}
- DIY Skill Level: ${userPreferences.diyLevel}/5
- Room Type: ${userPreferences.roomType}

Provide recommendations in this JSON format:
{
  "recommendations": [{
    "type": "product|diy|layout",
    "title": "Short descriptive title",
    "description": "Detailed explanation",
    "priority": 1-10,
    "impactScore": 1-10,
    "costEstimate": {"range": "low|medium|high", "amount": "$$$"},
    "timeEstimate": "X hours/days",
    "difficulty": 1-5,
    "steps": ["Step 1", "Step 2"],
    "products": ["Product suggestions"],
    "beforeAfter": "Expected outcome description"
  }]
}

Focus on practical, implementable solutions that match the user's constraints.
`;
  }

  rankAndCombineRecommendations(allRecommendations) {
    const { products, aiSuggestions, diy, layout, userPreferences } = allRecommendations;
    
    const allRecs = [...products, ...aiSuggestions, ...diy, ...layout];
    
    return allRecs
      .map(rec => this.calculateRecommendationScore(rec, userPreferences))
      .sort((a, b) => b.score - a.score)
      .slice(0, 15); // Return top 15 recommendations
  }

  calculateRecommendationScore(recommendation, userPreferences) {
    let score = 0;
    
    // Base score from AI confidence
    score += (recommendation.confidence || 0.5) * 30;
    
    // Budget alignment
    if (recommendation.costEstimate) {
      const budgetScore = this.calculateBudgetScore(recommendation.costEstimate, userPreferences.budget);
      score += budgetScore * 25;
    }
    
    // Impact score
    score += (recommendation.impactScore || 5) * 20;
    
    // DIY level match
    if (recommendation.type === 'diy') {
      const diyMatch = 1 - Math.abs((recommendation.difficulty || 3) - userPreferences.diyLevel) / 5;
      score += diyMatch * 15;
    }
    
    // Style compatibility
    if (recommendation.styleCompatibility) {
      score += recommendation.styleCompatibility * 10;
    }
    
    return {
      ...recommendation,
      score: Math.min(100, score),
      rankingFactors: {
        budgetAlignment: this.calculateBudgetScore(recommendation.costEstimate, userPreferences.budget),
        impact: recommendation.impactScore || 5,
        userMatch: this.calculateUserMatch(recommendation, userPreferences)
      }
    };
  }
}