use anchor_lang::prelude::*;

#[error_code]
pub enum ProjectError {
    #[msg("The project is not in the Ongoing status.")]
    ProjectNotOngoing,
}
