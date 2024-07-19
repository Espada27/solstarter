use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;

use crate::state::project::Reward;
use instructions::*;

declare_id!("DSwP4xKkeeV7g1T8rdJeQnSNitBWvywWPt3WngXHfKXk");

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
        goal_amount: u32,
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
}
