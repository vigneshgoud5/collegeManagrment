import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { getDatabase } from '../database/connection.js';
import { z } from 'zod';

export const tools: Tool[] = [
  {
    name: 'mongodb_query',
    description: 'Execute a MongoDB find query on a collection. Returns matching documents.',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          description: 'Name of the collection to query',
        },
        filter: {
          type: 'object',
          description: 'MongoDB filter object (query criteria)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of documents to return',
          default: 100,
        },
        sort: {
          type: 'object',
          description: 'Sort order (e.g., { field: 1 } for ascending, { field: -1 } for descending)',
        },
        projection: {
          type: 'object',
          description: 'Fields to include/exclude in results',
        },
      },
      required: ['collection'],
    },
  },
  {
    name: 'mongodb_insert',
    description: 'Insert one or more documents into a MongoDB collection.',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          description: 'Name of the collection',
        },
        documents: {
          type: 'array',
          description: 'Array of documents to insert',
          items: { type: 'object' },
        },
      },
      required: ['collection', 'documents'],
    },
  },
  {
    name: 'mongodb_update',
    description: 'Update documents in a MongoDB collection.',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          description: 'Name of the collection',
        },
        filter: {
          type: 'object',
          description: 'Filter to match documents to update',
        },
        update: {
          type: 'object',
          description: 'Update operations (use $set, $unset, etc.)',
        },
        upsert: {
          type: 'boolean',
          description: 'Create document if it does not exist',
          default: false,
        },
        multi: {
          type: 'boolean',
          description: 'Update multiple documents',
          default: false,
        },
      },
      required: ['collection', 'filter', 'update'],
    },
  },
  {
    name: 'mongodb_delete',
    description: 'Delete documents from a MongoDB collection.',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          description: 'Name of the collection',
        },
        filter: {
          type: 'object',
          description: 'Filter to match documents to delete',
        },
        multi: {
          type: 'boolean',
          description: 'Delete multiple documents',
          default: false,
        },
      },
      required: ['collection', 'filter'],
    },
  },
  {
    name: 'mongodb_aggregate',
    description: 'Execute an aggregation pipeline on a MongoDB collection.',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          description: 'Name of the collection',
        },
        pipeline: {
          type: 'array',
          description: 'Aggregation pipeline stages',
          items: { type: 'object' },
        },
      },
      required: ['collection', 'pipeline'],
    },
  },
  {
    name: 'mongodb_list_collections',
    description: 'List all collections in the database.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'mongodb_collection_stats',
    description: 'Get statistics about a collection (count, indexes, etc.).',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          description: 'Name of the collection',
        },
      },
      required: ['collection'],
    },
  },
];

export async function executeTool(name: string, args: any): Promise<any> {
  const db = getDatabase();

  try {
    switch (name) {
      case 'mongodb_query': {
        const { collection, filter = {}, limit = 100, sort, projection } = args;
        const coll = db.collection(collection);
        let query = coll.find(filter);
        
        if (sort) query = query.sort(sort);
        if (projection) query = query.project(projection);
        if (limit) query = query.limit(limit);
        
        const results = await query.toArray();
        return {
          success: true,
          count: results.length,
          documents: results,
        };
      }

      case 'mongodb_insert': {
        const { collection, documents } = args;
        const coll = db.collection(collection);
        const result = await coll.insertMany(documents);
        return {
          success: true,
          insertedCount: result.insertedCount,
          insertedIds: result.insertedIds,
        };
      }

      case 'mongodb_update': {
        const { collection, filter, update, upsert = false, multi = false } = args;
        const coll = db.collection(collection);
        const options = { upsert, ...(multi ? {} : {}) };
        const result = multi
          ? await coll.updateMany(filter, update, options)
          : await coll.updateOne(filter, update, options);
        return {
          success: true,
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
          upsertedCount: result.upsertedCount,
        };
      }

      case 'mongodb_delete': {
        const { collection, filter, multi = false } = args;
        const coll = db.collection(collection);
        const result = multi
          ? await coll.deleteMany(filter)
          : await coll.deleteOne(filter);
        return {
          success: true,
          deletedCount: result.deletedCount,
        };
      }

      case 'mongodb_aggregate': {
        const { collection, pipeline } = args;
        const coll = db.collection(collection);
        const results = await coll.aggregate(pipeline).toArray();
        return {
          success: true,
          count: results.length,
          documents: results,
        };
      }

      case 'mongodb_list_collections': {
        const collections = await db.listCollections().toArray();
        return {
          success: true,
          collections: collections.map((c) => ({
            name: c.name,
            type: c.type,
          })),
        };
      }

      case 'mongodb_collection_stats': {
        const { collection } = args;
        const coll = db.collection(collection);
        const count = await coll.countDocuments();
        const indexes = await coll.indexes();
        return {
          success: true,
          collection,
          documentCount: count,
          indexes: indexes.map((idx) => ({
            name: idx.name,
            key: idx.key,
          })),
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unknown error',
      details: error.toString(),
    };
  }
}

