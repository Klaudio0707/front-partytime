import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { guestSchema, type GuestFormData } from './validationSchema';
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
import styles from './GuestForm.module.css';

interface AddGuestFormProps {
  partyId: string;
  onGuestAdded: () => void;
}

const AddGuestForm = ({ partyId, onGuestAdded }: AddGuestFormProps) => {
  const { 
    register, 
    handleSubmit, 
    reset, // Para limpar o formulário após o envio
    formState: { errors, isSubmitting } 
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: '',
      phone: ''
    }
  });

  const onSubmit: SubmitHandler<GuestFormData> = async (data) => {
    const guestData = {
      ...data,
      partyId: partyId,
    };

    try {
      await apiFetch.post('/guests', guestData);
      useToast('Convidado adicionado com sucesso!', 'success');
      reset(); // Limpa o formulário
      onGuestAdded(); // Atualiza a lista no componente pai
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao adicionar convidado.';
      useToast(msg, 'error');
    }
  };

  return (
    <form className={styles.add_guest_form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.input_container}>
        <div className="input_group">
          <label htmlFor="guestName">Nome do Convidado:</label>
          <input 
            id="guestName"
            type="text" 
            placeholder="Nome do convidado" 
            className={`input_field ${errors.name ? 'input_error' : ''}`}
            {...register('name')} 
          />
          {errors.name && <p className="error_message">{errors.name.message}</p>}
        </div>
      </div>

      <div className={styles.input_container}>
        <div className="input_group">
          <label htmlFor="guestPhone">Telefone (com DDD):</label>
          <input 
            id="guestPhone"
            type="tel" 
            placeholder="Ex: 81999998888" 
            className={`input_field ${errors.phone ? 'input_error' : ''}`}
            {...register('phone')} 
          />
          {errors.phone && <p className="error_message">{errors.phone.message}</p>}
        </div>
      </div>
      
      <button type="submit" className={`btn ${styles.submit_button}`} disabled={isSubmitting}>
        {isSubmitting ? '...' : 'Adicionar'}
      </button>
    </form>
  );
};

export default AddGuestForm;