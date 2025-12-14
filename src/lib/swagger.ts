export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'NGO Impact Reporting API',
    version: '1.0.0',
    description: 'API for submitting reports and tracking NGO impact',
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      description: 'API Server',
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
  paths: {
    '/api/login': {
      post: {
        summary: 'Admin Login',
        description: 'Authenticate admin user and receive JWT token',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: {
                    type: 'string',
                    example: 'admin',
                  },
                  password: {
                    type: 'string',
                    example: 'admin123',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
          },
        },
      },
    },
    '/api/report': {
      post: {
        summary: 'Submit a single report',
        description: 'Submit monthly report data for an NGO',
        tags: ['Reports'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['ngoId', 'month'],
                properties: {
                  ngoId: {
                    type: 'string',
                    example: 'NGO001',
                  },
                  month: {
                    type: 'string',
                    format: 'date',
                    example: '2023-10',
                    pattern: '^\\d{4}-\\d{2}$',
                  },
                  peopleHelped: {
                    type: 'integer',
                    example: 150,
                  },
                  eventsConducted: {
                    type: 'integer',
                    example: 5,
                  },
                  fundsUtilized: {
                    type: 'number',
                    example: 50000.50,
                  },
                  region: {
                    type: 'string',
                    enum: ['North', 'South', 'East', 'West', 'All'],
                    example: 'South',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Report submitted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                    },
                    report: {
                      type: 'object',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Missing required fields',
          },
        },
      },
    },
    '/api/reports/upload': {
      post: {
        summary: 'Upload CSV report',
        description: 'Upload CSV file for bulk report processing',
        tags: ['Reports'],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                  },
                  region: {
                    type: 'string',
                    enum: ['North', 'South', 'East', 'West', 'All'],
                    example: 'South',
                  },
                },
              },
            },
          },
        },
        responses: {
          '202': {
            description: 'Upload started',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                    },
                    jobId: {
                      type: 'string',
                      format: 'uuid',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'No file uploaded',
          },
        },
      },
    },
    '/api/job-status/{id}': {
      get: {
        summary: 'Get job status',
        description: 'Get the processing status of a bulk upload job',
        tags: ['Jobs'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
            description: 'Job ID',
          },
        ],
        responses: {
          '200': {
            description: 'Job status',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    status: {
                      type: 'string',
                      enum: ['pending', 'processing', 'completed', 'failed'],
                    },
                    totalRows: {
                      type: 'integer',
                    },
                    processedRows: {
                      type: 'integer',
                    },
                    failedRows: {
                      type: 'integer',
                    },
                    errors: {
                      type: 'array',
                      items: {
                        type: 'object',
                      },
                    },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Job not found',
          },
        },
      },
    },
    '/api/jobs/{id}/reports': {
      get: {
        summary: 'Get job reports',
        description: 'Get reports associated with a job',
        tags: ['Jobs'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
            description: 'Job ID',
          },
        ],
        responses: {
          '200': {
            description: 'List of reports',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/dashboard': {
      get: {
        summary: 'Get dashboard stats',
        description: 'Get aggregated statistics for the dashboard',
        tags: ['Dashboard'],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: 'month',
            in: 'query',
            schema: {
              type: 'string',
              format: 'date',
              example: '2023-10',
            },
            description: 'Filter by month (YYYY-MM)',
          },
          {
            name: 'region',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['North', 'South', 'East', 'West', 'All'],
            },
            description: 'Filter by region',
          },
        ],
        responses: {
          '200': {
            description: 'Dashboard statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    stats: {
                      type: 'object',
                      properties: {
                        totalNGOs: {
                          type: 'integer',
                        },
                        totalPeopleHelped: {
                          type: 'integer',
                        },
                        totalEventsConducted: {
                          type: 'integer',
                        },
                        totalFundsUtilized: {
                          type: 'number',
                        },
                      },
                    },
                    regions: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
  },
};

