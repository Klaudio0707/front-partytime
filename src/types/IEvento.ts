export interface IEvento {
    id: string;
    title: string;
    budget: string;
    description: string;
    author: string;
    date: Date;
    user: {
      id: string;
      username: string;
    };
    image: string;
  }