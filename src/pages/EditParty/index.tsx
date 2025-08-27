import { useEffect, useState } from 'react';
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
    const [changePassword, setChangePassword] = useState(false);

  const {
  register, 
    handleSubmit, 
    reset,
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<EditPartyFormData>({
    resolver: zodResolver(editPartySchema),
    defaultValues: {
      password: '', 
    }
  });

  const currentTitle = watch("title"); // Observa o valor atual do campo 'title'

  // Busca os dados da festa para preencher o formulário
  useEffect(() => {
    const fetchPartyData = async () => {
      try {
        const response = await apiFetch.get(`/parties/${id}`);
        const party = response.data;

        const partyDate = new Date(party.date);
        const time = partyDate.toTimeString().slice(0, 5);
        // Usa a função 'reset' do react-hook-form para preencher todos os campos
        reset({
          // Garante que a data esteja no formato YYYY-MM-DD que o input espera
          ...party,
          date: partyDate.toISOString().split('T')[0], // Formata a data
          time: time, // Preenche o campo de hora
          password: '', // Deixa o campo de senha vazio por segurança
        });
      } catch (error) {
        useToast('Erro ao carregar dados da festa.', 'error');
      }
    };
    fetchPartyData();
  }, [id, reset]);

  const onSubmit: SubmitHandler<EditPartyFormData> = async (data) => {
    const partyData: any = {
      title: data.title,
      description: data.description,
      date: new Date(`${data.date}T${data.time}`).toISOString(),
      budget: data.budget,
      image: data.image,
    };

    // Apenas incluímos a senha na requisição se o checkbox estiver marcado
    if (changePassword) {
      partyData.password = data.password;
    }

    try {
      await apiFetch.patch(`/parties/${id}`, partyData);
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
        <h1 className="form_title">Editando a Festa: <br /><em>{currentTitle || "..."}</em></h1>
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
          <label htmlFor="time">Hora da Festa:</label>
          <input id="time" type="time" className={`input_field ${errors.time ? 'input_error' : ''}`} {...register('time')} />
          {errors.time && <p className="error_message">{errors.time.message}</p>}
        </div>

        <div className="input_group">
          <label htmlFor="description">Descrição:</label>
          <textarea id="description" className={`textarea_field ${errors.description ? 'input_error' : ''}`} {...register('description')} />
          {errors.description && <p className="error_message">{errors.description.message}</p>}
        </div>

        <div className="input_group">
          <label htmlFor="budget">Orçamento (R$):</label>
          <input id="budget" type="number" step="0.01" className={`input_field ${errors.budget ? 'input_error' : ''}`}  {...register('budget', { valueAsNumber: true })}
            {...register('budget', { valueAsNumber: true })}
          />
          {errors.budget && <p className="error_message">{errors.budget.message}</p>}
        </div>

        <div className="input_group">
          <label htmlFor="image">URL da Imagem:</label>
          <input id="image" type="url" className={`input_field ${errors.image ? 'input_error' : ''}`} {...register('image')} />
          {errors.image && <p className="error_message">{errors.image.message}</p>}
        </div>
         <div className="input_group">
          <div className="checkbox_group">
            <input 
              id="changePassword"
              type="checkbox" 
              checked={changePassword}
              onChange={(e) => setChangePassword(e.target.checked)}
            />
            <label htmlFor="changePassword">Alterar a Senha da Festa</label>
          </div>
        </div>
        
        
        {changePassword && (
          <div className="input_group">
            <label htmlFor="password">Nova Senha (Opcional):</label>
            <input 
              id="password" 
              type="password" 
              placeholder="Deixe em branco para remover a senha" 
              className={`input_field ${errors.password ? 'input_error' : ''}`} 
              {...register('password')} 
            />
            {errors.password && <p className="error_message">{errors.password.message}</p>}
          </div>
        )}
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