import { AbstractBackendClient } from "./AbstractBackendClient";

export default abstract class BackendClient<T> extends AbstractBackendClient<T> {
  protected async request(path: string, options: RequestInit): Promise<T> {
    try {
      const response = await fetch(path, options);

      if (!response.ok) {
        console.error("Error en la solicitud:", response.statusText);
        throw new Error(response.statusText);
      }

      if (response.status === 204 || response.headers.get("Content-Length") === "0") {
        throw new Error("Empty response");
      }

      return response.json();
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return Promise.reject(error);
    }
  }

  protected async requestAll(path: string, options: RequestInit): Promise<T[]> {
    try {
      const response = await fetch(path, options);

      if (!response.ok) {
        console.error("Error en la solicitud:", response.statusText);
        throw new Error(response.statusText);
      }

      return response.json();
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return Promise.reject(error);
    }
  }

  async get(url: string, id: number): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "GET",
    };
    return this.request(path, options);
  }

  async getAll(url: string): Promise<T[]> {
    const path = url;
    const options: RequestInit = {
      method: "GET",
    };
    return this.requestAll(path, options);
  }

  async post(url: string, data: T): Promise<T> {
    const path = url;
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    return this.request(path, options);
  }

  async put(url: string, id: number, data: T): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    return this.request(path, options);
  }

  async delete(url: string, id: number): Promise<void> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    await this.request(path, options);
  }

  // Generalized methods with token
  async getSec(url: string, token: string): Promise<T[]> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return this.requestAll(url, options);
  }

  async getById(url: string, id: number, token: string): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return this.request(path, options);
  }

  async postSec(url: string, data: T, token: string): Promise<T> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    return this.request(url, options);
  }

  async putSec(url: string, id: number, data: any, token: string): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };
    return this.request(path, options);
  }

  async deleteSec(url: string, id: number, token: string): Promise<void> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    await this.request(path, options);
  }
}
