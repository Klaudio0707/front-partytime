export interface IEvento {
    id: string;
    title: string;
    budget: string;
    description: string;
    user: {
      id: string;
      username: string;
    };
    image: string;
  }