use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;

use crate::state::project::Reward;
use instructions::*;

declare_id!("EPYqwH4n7Eu8n8NAwr1PorvsNJsjLfJDaQ7Q9QXxX8fX");

#[program]
pub mod solstarter {
    use super::*;

    pub fn create_user(
        ctx: Context<CreateUser>,
        name: String,
        bio: String,
        avatar_url: String,
    ) -> Result<()> {
        instructions::create_user(ctx, name, bio, avatar_url)
    }

    pub fn create_project(
        ctx: Context<CreateProject>,
        name: String,
        image_url: String,
        project_description: String,
        goal_amount: u64,
        end_time: i64,
        rewards: Vec<Reward>,
    ) -> Result<()> {
        instructions::create_project(
            ctx,
            name,
            image_url,
            project_description,
            goal_amount,
            end_time,
            rewards,
        )
    }

    pub fn add_contribution(ctx: Context<AddContribution>, amount: u64) -> Result<()> {
        instructions::add_contribution(ctx, amount)
    }
}
