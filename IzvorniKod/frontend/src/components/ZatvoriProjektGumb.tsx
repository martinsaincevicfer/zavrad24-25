import React, {useState} from 'react';
import axiosInstance from '../utils/axiosConfig';

interface Props {
  projektId: number;
  disabled?: boolean;
  onClosed?: () => void;
}

const ZatvoriProjektGumb: React.FC<Props> = ({projektId, disabled, onClosed}) => {
  const [loading, setLoading] = useState(false);

  const handleClose = async () => {
    if (!window.confirm('Jeste li sigurni da želite zatvoriti projekt?')) return;
    setLoading(true);
    try {
      await axiosInstance.patch(`/projekti/${projektId}/zatvori`);
      alert('Projekt je uspješno zatvoren.');
      if (onClosed) onClosed();
      else window.location.reload();
    } catch (e) {
      console.error(e);
      alert('Greška pri zatvaranju projekta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClose}
      disabled={loading || disabled}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {loading ? 'Zatvaram...' : 'Zatvori primanje ponuda'}
    </button>
  );
};

export default ZatvoriProjektGumb;