package io.github.jhipster.application.service;

import io.github.jhipster.application.domain.Question;
import io.github.jhipster.application.repository.QuestionRepository;
import io.github.jhipster.application.repository.search.QuestionSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Question.
 */
@Service
@Transactional
public class QuestionService {

    private final Logger log = LoggerFactory.getLogger(QuestionService.class);

    private final QuestionRepository questionRepository;

    private final QuestionSearchRepository questionSearchRepository;

    public QuestionService(QuestionRepository questionRepository, QuestionSearchRepository questionSearchRepository) {
        this.questionRepository = questionRepository;
        this.questionSearchRepository = questionSearchRepository;
    }

    /**
     * Save a question.
     *
     * @param question the entity to save
     * @return the persisted entity
     */
    public Question save(Question question) {
        log.debug("Request to save Question : {}", question);
        Question result = questionRepository.save(question);
        questionSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the questions.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Question> findAll(Pageable pageable) {
        log.debug("Request to get all Questions");
        return questionRepository.findAll(pageable);
    }

    /**
     * Get one question by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Question findOne(Long id) {
        log.debug("Request to get Question : {}", id);
        return questionRepository.findOne(id);
    }

    /**
     * Delete the question by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Question : {}", id);
        questionRepository.delete(id);
        questionSearchRepository.delete(id);
    }

    /**
     * Search for the question corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Question> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Questions for query {}", query);
        Page<Question> result = questionSearchRepository.search(queryStringQuery(query), pageable);
        return result;
    }
}
