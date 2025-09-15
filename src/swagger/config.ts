import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

// Updated Swagger definition for SokoLink (Wholesalers & Retailers)
const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SokoLink ',
    version: '1.0.0',
    description: 'API documentation for SokoLink  – connecting wholesalers, retailers, for product trading.',
    contact: {
      name: 'Development Team',
      email: 'dev@sokolink.com',
    },
  },
  servers: [

      {
      url: 'https://sokolink-backend-liuh.onrender.com/api',
      description: 'On Render Production',
    },
    
    {
      url: 'http://localhost:5000/api',
      description: 'Development server',
    },

  
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    { bearerAuth: [] }, // Apply JWT globally
  ],
  tags: [
    { name: 'Auth', description: 'User authentication and registration' },
    { name: 'Products', description: 'Product management and viewing' },
    { name: 'Wholesalers', description: 'Wholesaler-specific endpoints' },
    { name: 'Retailers', description: 'Retailer-specific endpoints' },
    { name: 'Ratings', description: 'Product ratings and reviews' },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/swagger/paths/*.yaml',    // Your path files
    './src/swagger/schemas/*.yaml',  // Your schema files
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
