// import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// import { useAuthStore } from '@/stores/auth.store';

// class ApiClient {
//   private axiosInstance: AxiosInstance;
//   private authStore = useAuthStore();
//   public baseUrl: string = `${import.meta.env.VITE_API_URL}`;

//   constructor() {
//     this.axiosInstance = axios.create({
//       baseURL: this.baseUrl,
//       timeout: 5000, // Set your preferred timeout
//     });
//   }

//   public getHeader(){
//     return {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': this.authHeader()
//       },
//     }
//   }

//   public authHeader() {
//     let user = this.authStore.user;
//     if (user && user.token) {
//       return 'Bearer ' + user.token;
//     } else {
//       return '';
//     }
//   }

//   async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
//     try {
//       const response: AxiosResponse<T> = await this.axiosInstance.get(url, {...config, ...this.getHeader()});
//       return response.data;
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
//     try {
//       const response: AxiosResponse<T> = await this.axiosInstance.post(url, data,  {...config, ...this.getHeader()});
//       return response.data;
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
//     try {
//       const response: AxiosResponse<T> = await this.axiosInstance.put(url, data,  {...config, ...this.getHeader()});
//       return response.data;
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
//     try {
//       const response: AxiosResponse<T> = await this.axiosInstance.delete(url,  {...config, ...this.getHeader()});
//       return response.data;
//     } catch (error) {
//       throw this.handleError(error);
//     }
//   }

//   private handleError(error: any) {
//   //   if (error.response && error.response.status) {
//   //     if (error.response.status == 403) {
//   //       push.warning('Sessão expirada. Faça login novamente.');
//   //       this.authStore.logout();
//   //     }else if (error.response.status == 400) {
//   //       if (error.response.data.errors){         
//   //         error.response.data.errors.forEach((er: Error) => {
//   //           push.error(er)
//   //         });
//   //       }
//   //       // throw new Error()
//   //     }else if (error.response.status == 500) {
//   //         push.error("Erro interno no servidor")
//   //     }
//   //   } else if (error.request) {
//   //     // push.error("Erro de comunicação com o servidor.")
//   //     console.log("Erro de comunicação com o servidor", error)
//   //   } else {
//   //     push.error("Erro desconhecido ao tentar comunicação com o servidor.")
//   //   }
//   // }
//   throw error
//   }
// }

// export default ApiClient;
