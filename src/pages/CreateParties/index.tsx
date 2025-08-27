import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partySchema, type PartyFormData } from './validationSchema'; // 👈 agora só 1 tipo
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
import styles from './CreateParty.module.css';

const CreateParty = () => {
  const navigate = useNavigate();

  // useForm tipado direto com PartyFormData
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PartyFormData>({
    resolver: zodResolver(partySchema),
  });

  const onSubmit: SubmitHandler<PartyFormData> = async (data) => {
    const partyData = { ...data, services: [] };

    try {
      const response = await apiFetch.post('/parties', partyData);
      const newPartyId = response.data.id;
      useToast('Festa criada com sucesso!', 'success');
      navigate(`/party/${newPartyId}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar a festa.';
      useToast(errorMessage, 'error');
    }
  };

  return (
    <div className={styles.create_party_page}>
      <h2>Crie sua Próxima Festa!</h2>
      <p>Preencha os detalhes abaixo para começar a planejar.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label className={styles.label}>
          <span>Título da Festa:</span>
          <input 
            type="text" 
            placeholder="Ex: Aniversário da Maria" 
            className={`${styles.input} ${errors.title ? styles.input_error : ''}`}
            {...register('title')} 
          />
          {errors.title && <p className={styles.error_message}>{errors.title.message}</p>}
        </label>
        
        <label className={styles.label}>
          <span>Data da Festa:</span>
          <input 
            type="date" 
            className={`${styles.input} ${errors.date ? styles.input_error : ''}`}
            {...register('date')} 
          />
          {errors.date && <p className={styles.error_message}>{errors.date.message}</p>}
        </label>

        <label className={styles.label}>
          <span>Descrição:</span>
          <textarea 
            placeholder="Conte mais sobre a festa, tema, etc." 
            className={`${styles.textarea} ${errors.description ? styles.input_error : ''}`}
            {...register('description')} 
          />
          {errors.description && <p className={styles.error_message}>{errors.description.message}</p>}
        </label>

        <label className={styles.label}>
          <span>Orçamento (R$):</span>
          <input 
            type="number" 
            placeholder="Ex: 1500.00" 
            min="0" 
            step="0.01" 
            className={`${styles.input} ${errors.budget ? styles.input_error : ''}`}
            {...register('budget', { valueAsNumber: true })} // 👈 garante number
          />
          {errors.budget && <p className={styles.error_message}>{errors.budget.message}</p>}
        </label>

        <label className={styles.label}>
          <span>URL da Imagem de Capa (Opcional):</span>
          <input 
            type="url" 
            placeholder="https://exemplo.com/imagem.jpg"
            className={`${styles.input} ${errors.image ? styles.input_error : ''}`}
            {...register('image')} 
          />
          {errors.image && <p className={styles.error_message}>{errors.image.message}</p>}
        </label>

        <label className={styles.label}>
          <span>Senha da Festa (Opcional):</span>
          <input 
            type="password" 
            placeholder="Mínimo de 4 caracteres" 
            className={`${styles.input} ${errors.password ? styles.input_error : ''}`}
            {...register('password')} 
          />
          {errors.password && <p className={styles.error_message}>{errors.password.message}</p>}
        </label>
        
        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? 'Criando festa...' : 'Criar Festa'}
        </button>
      </form>
    </div>
  );
};

export default CreateParty;
