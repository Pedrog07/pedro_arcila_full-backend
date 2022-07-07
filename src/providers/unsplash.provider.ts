import { Injectable } from '@nestjs/common';
import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';
import axios from 'axios';

@Injectable()
export class UnsplashProvider {
  photos: ReturnType<typeof createApi>['photos'];
  users: ReturnType<typeof createApi>['users'];
  search: ReturnType<typeof createApi>['search'];
  collections: ReturnType<typeof createApi>['collections'];
  topics: ReturnType<typeof createApi>['topics'];

  constructor() {
    const { photos, users, search, collections, topics } = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
      fetch: nodeFetch as unknown as typeof fetch,
    });
    this.photos = photos;
    this.users = users;
    this.search = search;
    this.collections = collections;
    this.topics = topics;
  }

  async searchPhotos(search: string, page: number, perPage: number) {
    const {
      response: { total, total_pages, results },
    } = await this.search.getPhotos({ query: search, page, perPage });
    return {
      total,
      totalPages: total_pages,
      results: results.map((res) => ({
        id: res.id,
        description: res.description,
        altDescription: res.alt_description,
        url: res.urls.small,
      })),
    };
  }

  async getPhoto(photoId: string) {
    const { response } = await this.photos.get({ photoId });

    return { url: response?.urls.small };
  }
}
