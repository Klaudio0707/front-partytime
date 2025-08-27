import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editPartySchema, type EditPartyFormData } from './validationSchema';
import apiFetch from '../../api/config';
import useToast from '../../hooks/useToast';
// Vamos reutilizar os estilos globais de formulário
// import styles from './EditParty.module.css'; 

const EditParty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    reset, // Função para preencher o formulário
    watch, // Função para observar os valores do formulário
    formState: { errors, isSubmitting } 
  } = useForm<EditPartyFormData>({
    resolver: zodResolver(editPartySchema)
  });

  const currentTitle = watch("title"); // Observa o valor atual do campo 'title'

  // Busca os dados da festa para preencher o formulário
  useEffect(() => {
    const fetchPartyData = async () => {
      try {
        const response = await apiFetch.get(`/parties/${id}`);
        const party = response.data;
        
        // Usa a função 'reset' do react-hook-form para preencher todos os campos
        reset({
          ...party,
          // Garante que a data esteja no formato YYYY-MM-DD que o input espera
          date: party.date ? new Date(party.date).toISOString().split('T')[0] : '',
        });
      } catch (error) {
        useToast('Erro ao carregar dados da festa.', 'error');
      }
    };
    fetchPartyData();
  }, [id, reset]);

  const onSubmit: SubmitHandler<EditPartyFormData> = async (data) => {
    try {
      await apiFetch.patch(`/parties/${id}`, data);
      useToast('Festa atualizada com sucesso!', 'success');
      navigate(`/party/${id}`); // Volta para a página de detalhes
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao atualizar a festa.';
      useToast(msg, 'error');
    }
  };

  return (
    <div className="form_page_container">
      <form onSubmit={handleSubmit(onSubmit)} className="form_card">
        <h1 className="form_title">Editando a Festa: <br/><em>{currentTitle || "..."}</em></h1>
        <p className="form_subtitle">Altere os campos que desejar.</p>
        
        <div className="input_group">
          <label htmlFor="title">Título da Festa:</label>
          <input id="title" type="text" className={`input_field ${errors.title ? 'input_error' : ''}`} {...register('title')} />
          {errors.title && <p className="error_message">{errors.title.message}</p>}
        </div>

        <div className="input_group">
          <label htmlFor="date">Data da Festa:</label>
          <input id="date" type="date" className={`input_field ${errors.date ? 'input_error' : ''}`} {...register('date')} />
          {errors.date && <p className="error_message">{errors.date.message}</p>}
        </div>

        <div className="input_group">
          <label htmlFor="description">Descrição:</label>
          <textarea id="description" className={`textarea_field ${errors.description ? 'input_error' : ''}`} {...register('description')} />
          {errors.description && <p className="error_message">{errors.description.message}</p>}
        </div>

        <div className="input_group">
          <label htmlFor="budget">Orçamento (R$):</label>
          <input id="budget" type="number" step="0.01" className={`input_field ${errors.budget ? 'input_error' : ''}`} {...register('budget')} />
          {errors.budget && <p className="error_message">{errors.budget.message}</p>}
        </div>

        <div className="input_group">
          <label htmlFor="image">URL da Imagem:</label>
          <input id="image" type="url" className={`input_field ${errors.image ? 'input_error' : ''}`} {...register('image')} />
          {errors.image && <p className="error_message">{errors.image.message}</p>}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'A salvar...' : 'Salvar Alterações'}
          </button>
          <Link to={`/party/${id}`} className="btn btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditParty;