import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema, type ServiceFormData } from './validationSchema';
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
import styles from './AddService.module.css';

interface AddServiceFormProps {
  partyId: string;
  onServiceAdded: () => void;
}

const AddServiceForm = ({ partyId, onServiceAdded }: AddServiceFormProps) => {
  const { 
  register, 
  handleSubmit, 
  reset,
  formState: { errors, isSubmitting } 
// 👇 Adicione o tipo <ServiceFormData> aqui
} = useForm<ServiceFormData>({
  resolver: zodResolver(serviceSchema),
  defaultValues: {
    name: '',
    price: undefined, // Melhor iniciar como undefined para o placeholder funcionar
  }
});





  const onSubmit: SubmitHandler<ServiceFormData> = async (data) => {
    const serviceData = {
      ...data,
      partyId: partyId,
    };

    try {
      await apiFetch.post('/services', serviceData);
      useToast('Serviço adicionado com sucesso!', 'success');
      reset(); // Limpa o formulário
      onServiceAdded(); // Atualiza a lista no componente pai
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao adicionar serviço.';
      useToast(msg, 'error');
    }
  };

  return (
    <form className={styles.add_service_form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.input_container}>
        <div className="input_group">
          <label htmlFor="serviceName">Nome do Serviço:</label>
          <input 
            id="serviceName"
            type="text" 
            placeholder="Ex: DJ, Buffet, Decoração" 
            className={`input_field ${errors.name ? 'input_error' : ''}`}
            {...register('name')} 
          />
          {errors.name && <p className="error_message">{errors.name.message}</p>}
        </div>
      </div>

      <div className={styles.input_container}>
        <div className="input_group">
          <label htmlFor="servicePrice">Preço (R$):</label>
          <input 
            id="servicePrice"
            type="number" 
            placeholder="Ex: 500.00" 
            step="0.01"
            className={`input_field ${errors.price ? 'input_error' : ''}`}
            {...register('price')} 
          />
          {errors.price && <p className="error_message">{errors.price.message}</p>}
        </div>
      </div>
      
      <button type="submit" className={`btn ${styles.submit_button}`} disabled={isSubmitting}>
        {isSubmitting ? '...' : 'Adicionar'}
      </button>
    </form>
  );
};

export default AddServiceForm;