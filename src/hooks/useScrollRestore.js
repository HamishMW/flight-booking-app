import { useContext, useEffect } from 'react';
import { AppContext } from 'app';

const useScrollRestore = status => {
  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    if (status === 'entered') {
      dispatch({ type: 'setScrolled', value: false });
    }
  }, [dispatch, status]);
};

export default useScrollRestore;
